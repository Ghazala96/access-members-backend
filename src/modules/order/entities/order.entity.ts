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

  @Field(() => Event, { nullable: true })
  @ManyToOne(() => Event)
  event: Event;

  @Field(() => [PurchaseItem], { nullable: true })
  @OneToMany(() => PurchaseItem, (item) => item.order)
  items: PurchaseItem[];

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: string;

  @Field()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Created })
  status: OrderStatus;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  createdBy: User;
}
