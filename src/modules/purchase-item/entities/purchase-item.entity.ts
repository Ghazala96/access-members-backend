import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { PurchaseItemType } from '../purchase-item.constants';

@ObjectType()
@Entity()
export class PurchaseItem extends BaseEntity {
  @Field()
  @Column({ type: 'enum', enum: PurchaseItemType })
  itemType: PurchaseItemType;

  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.items, { eager: true })
  cart: Cart;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
