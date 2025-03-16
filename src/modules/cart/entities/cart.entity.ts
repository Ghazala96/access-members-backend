import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';
import { PurchaseItem } from '../../purchase-item/entities/purchase-item.entity';
import { CartStatus } from '../cart.constants';
import { Order } from '../../order/entities/order.entity';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => Event, { nullable: true })
  @ManyToOne(() => Event)
  event: Event;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  createdBy: User;

  @Field()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: string;

  @Field()
  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.Active })
  status: CartStatus;

  @Field(() => [PurchaseItem], { nullable: true })
  @OneToMany(() => PurchaseItem, (item) => item.cart)
  items: PurchaseItem[];

  @Field(() => Order, { nullable: true })
  @OneToOne(() => Order)
  @JoinColumn()
  sealingOrder: Order;
}
