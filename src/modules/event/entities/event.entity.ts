import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { EventTemplate } from './event-template.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Event extends BaseEntity {
  @Column('timestamp')
  date: Date;

  @ManyToOne(() => EventTemplate, (template) => template.events, { onDelete: 'CASCADE' })
  template: EventTemplate;

  @ManyToOne(() => User, (user) => user.events, { eager: true })
  createdBy: User;

  @OneToMany(() => Ticket, (ticket) => ticket.event, { cascade: true })
  tickets: Ticket[];
}
