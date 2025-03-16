import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { DeletableEntity } from 'src/common/entities/deletable-entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { PurchaseItemType } from '../purchase-item.constants';

@ObjectType()
@Entity()
export class PurchaseItem extends DeletableEntity {
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
  unitPrice: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: string;

  @Field(() => Cart, { nullable: true })
  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
