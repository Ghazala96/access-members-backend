import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchaseItemResolver } from './purchase-item.resolver';
import { PurchaseItemService } from './purchase-item.service';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { CartModule } from '../cart/cart.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseItem]),
    UserModule,
    EventModule,
    CartModule,
    TicketModule
  ],
  providers: [PurchaseItemResolver, PurchaseItemService]
})
export class PurchaseItemModule {}
