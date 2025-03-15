import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Event } from '../../event/entities/event.entity';
import { TicketPriceHistory } from './ticket-price-history.entity';
import { TicketLedger } from './ticket-ledger.entity';
import { TicketStatus } from '../ticket.constants';

@ObjectType()
@Entity()
@Unique(['event', 'type'])
export class Ticket extends BaseEntity {
  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.tickets, { eager: true })
  event: Event;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column()
  originalQuantity: number;

  @Field(() => Int)
  @Column()
  availableQuantity: number;

  @Field()
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.Available })
  status: TicketStatus;

  @Field(() => [TicketPriceHistory])
  @OneToMany(() => TicketPriceHistory, (priceHistory) => priceHistory.ticket)
  priceHistory: TicketPriceHistory[];

  @Field(() => [TicketLedger])
  @OneToMany(() => TicketLedger, (ledger) => ledger.ticket)
  ledgerEntries: TicketLedger[];
}
