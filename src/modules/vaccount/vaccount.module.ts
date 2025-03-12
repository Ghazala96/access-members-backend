import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VAccount, VAccountLedger])],
  providers: []
})
export class VaccountModule {}
