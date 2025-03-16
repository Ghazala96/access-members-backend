import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { DecodedAuthToken } from '../auth/auth.types';
import { PurchaseItem } from './entities/purchase-item.entity';
import { UserService } from '../user/user.service';
import { AddPurchaseItemInput } from './dtos/add-purchase-item.input';
import { TicketService } from '../ticket/ticket.service';
import { CartService } from '../cart/cart.service';
import { CartStatus } from '../cart/cart.constants';
import { PurchaseItemType } from './purchase-item.constants';
import { Cart } from '../cart/entities/cart.entity';
import { TicketStatus } from '../ticket/ticket.constants';
import { UpdatePurchaseItemInput } from './dtos/update-purchase-item.input';
import { EventService } from '../event/event.service';

@Injectable()
export class PurchaseItemService {
  constructor(
    @InjectRepository(PurchaseItem) private readonly purchaseItemRepo: Repository<PurchaseItem>,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly cartService: CartService,
    private readonly ticketService: TicketService
  ) {}

  async addPurchaseItem(
    cartId: number,
    inputItem: AddPurchaseItemInput,
    decoded: DecodedAuthToken
  ): Promise<PurchaseItem> {
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
    if (
      cart.items.length &&
      cart.items.some(
        (item) =>
          item.itemType === inputItem.itemType &&
          item.itemId === inputItem.itemId &&
          !item.deletedAt
      )
    ) {
      throw new ConflictException('Item already exists in cart');
    }

    switch (inputItem.itemType) {
      case PurchaseItemType.Ticket:
        return this.addTicketPurchaseItem(cart, inputItem.itemId, inputItem.quantity);
      default:
        throw new NotFoundException('Item type not found');
    }
  }

  private async addTicketPurchaseItem(
    cart: Cart,
    ticketId: number,
    quantity: number
  ): Promise<PurchaseItem> {
    const ticket = await this.ticketService.findOne({
      where: {
        id: ticketId,
        status: TicketStatus.Available,
        event: { id: cart.event.id }
      }
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (quantity > ticket.availableQuantity) {
      throw new ConflictException('Ticket quantity not available');
    }

    const unitPrice: number = parseFloat(ticket.price);
    const itemTotalPrice: number = unitPrice * quantity;
    const newCartTotalPrice: number = parseFloat(cart.totalPrice) + itemTotalPrice;
    const updatedCart = await this.cartService.updateCartTotalPrice(cart, newCartTotalPrice);
    const purchaseItem = this.purchaseItemRepo.create({
      itemType: PurchaseItemType.Ticket,
      itemId: ticketId,
      quantity,
      unitPrice: unitPrice.toFixed(2),
      totalPrice: itemTotalPrice.toFixed(2),
      cart: updatedCart
    });
    const savedPurchaseItem = await this.purchaseItemRepo.save(purchaseItem);

    return savedPurchaseItem;
  }

  async updatePurchaseItem(
    purchaseItemId: number,
    input: UpdatePurchaseItemInput,
    decoded: DecodedAuthToken
  ): Promise<PurchaseItem> {
    const user = await this.userService.validateUser(decoded.sub);
    const purchaseItem = await this.purchaseItemRepo.findOne({
      where: {
        id: purchaseItemId,
        cart: {
          createdBy: { id: user.id },
          status: CartStatus.Active
        },
        deletedAt: null
      },
      relations: ['cart']
    });
    if (!purchaseItem) {
      throw new NotFoundException('Purchase item not found');
    }

    switch (purchaseItem.itemType) {
      case PurchaseItemType.Ticket:
        return this.updateTicketPurchaseItem(purchaseItem, purchaseItem.itemId, input);
      default:
        throw new NotFoundException('Item type not found');
    }
  }

  async updateTicketPurchaseItem(
    purchaseItem: PurchaseItem,
    ticketId: number,
    input: UpdatePurchaseItemInput
  ): Promise<PurchaseItem> {
    const ticket = await this.ticketService.findOne({
      where: { id: ticketId, status: TicketStatus.Available }
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (input.quantity > ticket.availableQuantity) {
      throw new ConflictException('Ticket quantity not available');
    }

    const newItemTotalPrice: number = parseFloat(purchaseItem.unitPrice) * input.quantity;
    const newCartTotalPrice: number =
      parseFloat(purchaseItem.cart.totalPrice) -
      parseFloat(purchaseItem.totalPrice) +
      newItemTotalPrice;
    const updatedCart = await this.cartService.updateCartTotalPrice(
      purchaseItem.cart,
      newCartTotalPrice
    );
    purchaseItem.quantity = input.quantity;
    purchaseItem.totalPrice = newItemTotalPrice.toFixed(2);
    purchaseItem.cart = updatedCart;
    const updatedPurchaseItem = await this.purchaseItemRepo.save(purchaseItem);

    return updatedPurchaseItem;
  }

  async removePurchaseItem(purchaseItemId: number, decoded: DecodedAuthToken): Promise<boolean> {
    const user = await this.userService.validateUser(decoded.sub);
    const purchaseItem = await this.purchaseItemRepo.findOne({
      where: {
        id: purchaseItemId,
        cart: {
          createdBy: { id: user.id },
          status: CartStatus.Active
        },
        deletedAt: null
      },
      relations: ['cart']
    });
    if (!purchaseItem) {
      throw new NotFoundException('Purchase item not found');
    }

    const newCartTotalPrice: number =
      parseFloat(purchaseItem.cart.totalPrice) - parseFloat(purchaseItem.totalPrice);
    const updatedCart = await this.cartService.updateCartTotalPrice(
      purchaseItem.cart,
      newCartTotalPrice
    );
    purchaseItem.deletedAt = DateTime.utc().toJSDate();
    purchaseItem.cart = updatedCart;
    await this.purchaseItemRepo.save(purchaseItem);

    return true;
  }
}
