import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { Ticket } from './ticket.entity';
import { Order } from '../../order/entities/order.entity';
import { TicketLedgerOperation } from '../ticket.constants';

@Entity()
export class TicketLedger extends BaseEntity {
  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => Ticket)
  ticket: Ticket;

  @Column()
  previousBalance: number;

  @Column()
  balanceChange: number;

  @Column({ type: 'enum', enum: TicketLedgerOperation })
  operation: TicketLedgerOperation;

  @Column()
  newBalance: number;

  @ManyToOne(() => Order)
  order: Order;
}
