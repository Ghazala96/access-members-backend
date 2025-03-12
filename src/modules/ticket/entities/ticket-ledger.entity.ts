import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { Ticket } from './ticket.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class TicketLedger extends BaseEntity {
  @ManyToOne(() => Event, { eager: true })
  event: Event;

  @ManyToOne(() => Ticket, { eager: true })
  ticket: Ticket;

  @Column()
  previousBalance: number;

  @Column()
  balanceChange: number;

  @Column({ type: 'enum', enum: ['+', '-'] })
  operation: '+' | '-';

  @Column()
  newBalance: number;

  @ManyToOne(() => Order, { eager: true })
  order: Order;
}
