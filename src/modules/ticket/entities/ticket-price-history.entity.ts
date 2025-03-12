import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Ticket } from './ticket.entity';

@Entity()
export class TicketPriceHistory extends BaseEntity {
  @ManyToOne(() => Ticket, (ticket) => ticket.priceHistory, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('timestamp')
  validFrom: Date;

  @Column('timestamp', { nullable: true })
  validTo: Date;
}
