import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';
import { VAccountResolver } from './vaccount.resolver';
import { VAccountService } from './vaccount.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([VAccount, VAccountLedger]), UserModule],
  providers: [VAccountResolver, VAccountService],
  exports: [VAccountService]
})
export class VAccountModule {}
