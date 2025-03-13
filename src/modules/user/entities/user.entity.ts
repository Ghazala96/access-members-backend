import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from '../../order/entities/order.entity';
import { Event } from '../../event/entities/event.entity';
import { EventTemplate } from '../../event/entities/event-template.entity';
import { Role } from './role.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [Role])
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @Field(() => [EventTemplate])
  @OneToMany(() => EventTemplate, (template) => template.createdBy)
  eventTemplates: EventTemplate[];

  @Field(() => [Event])
  @OneToMany(() => Event, (event) => event.createdBy)
  events: Event[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
