import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketLedger } from './entities/ticket-ledger.entity';
import { TicketPriceHistory } from './entities/ticket-price-history.entity';
import { TicketResolver } from './ticket.resolver';
import { TicketService } from './ticket.service';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketLedger, TicketPriceHistory]),
    UserModule,
    EventModule
  ],
  providers: [TicketResolver, TicketService],
  exports: [TicketService]
})
export class TicketModule {}
