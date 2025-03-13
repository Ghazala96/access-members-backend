import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus, OrderType } from '../order.constants';

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field()
  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Field()
  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
