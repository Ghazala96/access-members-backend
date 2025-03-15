import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { CartModule } from '../cart/cart.module';
import { EventModule } from '../event/event.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, CartModule, EventModule, TicketModule],
  providers: [OrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}
