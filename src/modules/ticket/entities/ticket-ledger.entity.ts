import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { Ticket } from './ticket.entity';
import { Order } from '../../order/entities/order.entity';
import { TicketLedgerOperation } from '../ticket.constants';

@ObjectType()
@Entity()
export class TicketLedger extends BaseEntity {
  @Field(() => Event)
  @ManyToOne(() => Event, { eager: true })
  event: Event;

  @Field(() => Ticket)
  @ManyToOne(() => Ticket, { eager: true })
  ticket: Ticket;

  @Field(() => Int)
  @Column()
  previousBalance: number;

  @Field(() => Int)
  @Column()
  balanceChange: number;

  @Field()
  @Column({ type: 'enum', enum: TicketLedgerOperation })
  operation: TicketLedgerOperation;

  @Field(() => Int)
  @Column()
  newBalance: number;

  @Field(() => Order)
  @ManyToOne(() => Order, { eager: true })
  order: Order;
}
