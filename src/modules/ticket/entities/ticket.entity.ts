import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { TicketPriceHistory } from './ticket-price-history.entity';
import { TicketLedger } from './ticket-ledger.entity';

@Entity()
@Unique(['event', 'type'])
export class Ticket extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.tickets, { eager: true })
  event: Event;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => TicketPriceHistory, (priceHistory) => priceHistory.ticket)
  priceHistory: TicketPriceHistory[];

  @OneToMany(() => TicketLedger, (ledger) => ledger.ticket)
  ledgerEntries: TicketLedger[];
}

//TODO: Add ticketsAvailable field to Ticket entity?
