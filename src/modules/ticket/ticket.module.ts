import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketLedger } from './entities/ticket-ledger.entity';
import { TicketPriceHistory } from './entities/ticket-price-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketLedger, TicketPriceHistory])],
  providers: []
})
export class TicketModule {}
