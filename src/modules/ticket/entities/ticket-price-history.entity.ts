import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Ticket } from './ticket.entity';

@ObjectType()
@Entity()
export class TicketPriceHistory extends BaseEntity {
  @Field(() => Ticket)
  @ManyToOne(() => Ticket, (ticket) => ticket.priceHistory, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Date)
  @Column('timestamp')
  validFrom: Date;

  @Field(() => Date)
  @Column('timestamp', { nullable: true })
  validTo: Date;
}
