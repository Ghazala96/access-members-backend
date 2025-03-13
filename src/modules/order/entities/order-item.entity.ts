import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from '../../order/entities/order.entity';
import { OrderItemType } from '../order.constants';

@ObjectType()
@Entity()
export class OrderItem extends BaseEntity {
  @Field()
  @Column({ type: 'enum', enum: OrderItemType })
  itemType: OrderItemType;

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

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items, { eager: true })
  order: Order;
}
