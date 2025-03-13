import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';
import { VAccountService } from './vaccount.service';

@Module({
  imports: [TypeOrmModule.forFeature([VAccount, VAccountLedger])],
  providers: [VAccountService],
  exports: [VAccountService]
})
export class VAccountModule {}
