import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from '../../order/entities/order.entity';
import { Event } from '../../event/entities/event.entity';
import { EventTemplate } from '../../event/entities/event-template.entity';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => EventTemplate, (template) => template.createdBy)
  eventTemplates: Event[];

  @OneToMany(() => Event, (event) => event.createdBy)
  events: Event[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
