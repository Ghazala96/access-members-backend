import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cart } from './entities/cart.entity';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UserModule, EventModule],
  providers: [CartResolver, CartService],
  exports: [CartService]
})
export class CartModule {}
