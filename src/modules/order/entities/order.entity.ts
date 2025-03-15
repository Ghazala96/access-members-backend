import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../order.constants';
import { Event } from '../../event/entities/event.entity';
import { PurchaseItem } from '../../purchase-item/entities/purchase-item.entity';

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  // Shortcut
  // @Field()
  // @Column({ type: 'enum', enum: OrderEntityType })
  // entityType: OrderEntityType;

  // @Field(() => Int)
  // @Column()
  // entityId: number;

  @Field(() => Event)
  @ManyToOne(() => Event, { eager: true })
  event: Event;

  @Field(() => [PurchaseItem])
  @OneToMany(() => PurchaseItem, (item) => item.order)
  items: PurchaseItem[];

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Field()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Created })
  status: OrderStatus;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  createdBy: User;
}
