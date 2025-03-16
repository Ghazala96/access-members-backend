import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Ticket } from './ticket.entity';

@ObjectType()
@Entity()
export class TicketPriceHistory extends BaseEntity {
  @Field(() => Ticket, { nullable: true })
  @ManyToOne(() => Ticket, (ticket) => ticket.priceHistory, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Field(() => Date)
  @Column('timestamp')
  validFrom: Date;

  @Field(() => Date, { nullable: true })
  @Column('timestamp', { nullable: true })
  validTo?: Date;
}
