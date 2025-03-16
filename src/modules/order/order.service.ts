import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { UserService } from '../user/user.service';
import { DecodedAuthToken } from '../auth/auth.types';
import { OrderStatus } from './order.constants';
import { EventService } from '../event/event.service';
import { CartService } from '../cart/cart.service';
import { CartStatus } from '../cart/cart.constants';
import { TicketService } from '../ticket/ticket.service';
import { EventStatus } from '../event/event.constants';
import { PurchaseItemType } from '../purchase-item/purchase-item.constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly eventService: EventService,
    private readonly ticketService: TicketService
  ) {}

  async createOrder(cartId: number, decoded: DecodedAuthToken): Promise<Order> {
    const user = await this.userService.validateUser(decoded.sub);
    const cart = await this.cartService.findOne({
      where: {
        id: cartId,
        createdBy: { id: user.id },
        status: CartStatus.Active
      },
      relations: ['event', 'items']
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }
    const ticketItems = cart.items.filter((item) => item.itemType === PurchaseItemType.Ticket);
    if (!ticketItems.length) {
      throw new BadRequestException('Cart does not contain any tickets');
    }

    const existingOrder = await this.orderRepo.findOne({
      where: {
        event: { id: cart.event.id },
        status: OrderStatus.Created,
        createdBy: { id: user.id }
      },
      relations: ['items']
    });
    if (existingOrder) {
      return existingOrder;
    }

    const event = await this.eventService.findOne({
      where: { id: cart.event.id, status: EventStatus.Listed },
      relations: ['tickets']
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const ticketAvailabilityMap = new Map(
      event.tickets.map((ticket) => [ticket.id, ticket.availableQuantity])
    );
    for (const item of ticketItems) {
      const availableQuantity = ticketAvailabilityMap.get(item.itemId);
      if (item.quantity > availableQuantity) {
        throw new ConflictException('Ticket quantity exceeds available quantity');
      }
    }

    await this.ticketService.holdTickets(event, ticketItems);
    const order = this.orderRepo.create({
      event,
      items: cart.items,
      totalPrice: cart.totalPrice,
      createdBy: user
    });
    const savedOrder = await this.orderRepo.save(order);
    await this.cartService.sealCart(cart, savedOrder);

    return savedOrder;
  }

  //TODO: Add status filter and pagination
  async getOrders(decoded: DecodedAuthToken): Promise<Order[]> {
    const user = await this.userService.validateUser(decoded.sub);
    return this.orderRepo.find({
      where: { createdBy: { id: user.id } }
    });
  }

  async getOrder(orderId: number, decoded: DecodedAuthToken): Promise<Order> {
    const user = await this.userService.validateUser(decoded.sub);
    const order = await this.orderRepo.findOne({
      where: { id: orderId, createdBy: { id: user.id } },
      relations: ['event', 'items']
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(order: Order, status: OrderStatus): Promise<Order> {
    order.status = status;
    return this.orderRepo.save(order);
  }

  async findOne(options: FindOneOptions<Order>): Promise<Order | null> {
    return this.orderRepo.findOne(options);
  }
}
