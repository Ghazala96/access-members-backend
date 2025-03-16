import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { EventTemplate } from './event-template.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { User } from '../../user/entities/user.entity';
import { EventStatus } from '../event.constants';

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(() => Date)
  @Column('timestamp')
  date: Date;

  @Field()
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.Draft })
  status: EventStatus;

  @Field(() => EventTemplate)
  @ManyToOne(() => EventTemplate, (template) => template.events, {
    eager: true,
    onDelete: 'CASCADE'
  })
  template: EventTemplate;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  createdBy: User;

  @Field(() => Int)
  @Column({ default: 0 })
  originalTicketsQuantity: number;

  @Field(() => Int)
  @Column({ default: 0 })
  availableTicketsQuantity: number;

  @Field(() => [Ticket], { nullable: true })
  @OneToMany(() => Ticket, (ticket) => ticket.event, { cascade: true })
  tickets: Ticket[];
}
