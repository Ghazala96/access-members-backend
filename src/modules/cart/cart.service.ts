import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { DecodedAuthToken } from '../auth/auth.types';
import { Cart } from './entities/cart.entity';
import { CartStatus } from './cart.constants';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { EventStatus } from '../event/event.constants';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  async initiateCart(eventId: number, decoded: DecodedAuthToken): Promise<Cart> {
    const user = await this.userService.validateUser(decoded.sub);
    const existingCart = await this.cartRepo.findOne({
      where: {
        createdBy: { id: user.id },
        status: CartStatus.Active
      }
    });
    if (existingCart) {
      if (existingCart.event.id === eventId) {
        return existingCart;
      } else {
        throw new ConflictException('Cart already exists for another event');
      }
    }

    const event = await this.eventService.findOne({
      where: { id: eventId, status: EventStatus.Published }
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (user.id === event.createdBy.id) {
      //TODO: Add to greylist for security team to investigate?

      throw new ConflictException('You cannot add your own event to cart');
    }

    const cart = this.cartRepo.create({ event, createdBy: user });
    const savedCart = await this.cartRepo.save(cart);

    return savedCart;
  }

  async getActiveCart(decoded: DecodedAuthToken): Promise<Cart> {
    const user = await this.userService.validateUser(decoded.sub);
    const cart = await this.cartRepo.findOne({
      where: {
        createdBy: { id: user.id },
        status: CartStatus.Active
      }
    });
    if (!cart) {
      throw new NotFoundException('No active cart found');
    }

    return cart;
  }

  async abandonActiveCart(decoded: DecodedAuthToken): Promise<boolean> {
    const user = await this.userService.validateUser(decoded.sub);
    const cart = await this.cartRepo.findOne({
      where: {
        createdBy: { id: user.id },
        status: CartStatus.Active
      }
    });
    if (!cart) {
      throw new NotFoundException('No active cart found');
    }

    cart.status = CartStatus.Abandoned;
    await this.cartRepo.save(cart);

    return true;
  }

  async updateCartTotalPrice(cart: Cart, newTotalPrice: number): Promise<Cart> {
    cart.totalPrice = newTotalPrice;
    return this.cartRepo.save(cart);
  }

  async sealCart(cart: Cart, sealingOrder: Order): Promise<Cart> {
    cart.status = CartStatus.Sealed;
    cart.sealingOrder = sealingOrder;
    return this.cartRepo.save(cart);
  }

  async findOne(options: FindOneOptions<Cart>): Promise<Cart | null> {
    return this.cartRepo.findOne(options);
  }
}
