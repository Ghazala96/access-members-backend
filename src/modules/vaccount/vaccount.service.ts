import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Repository } from 'typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';
import { VAccountEntity } from './vaccount.types';
import { VAccountLedgerOperation } from './vaccount.constants';

@Injectable()
export class VAccountService {
  constructor(
    @InjectRepository(VAccount) private readonly vAccountRepo: Repository<VAccount>,
    @InjectRepository(VAccountLedger)
    private readonly vAccountLedgerRepo: Repository<VAccountLedger>
  ) {}

  async createVAccount(entity: VAccountEntity): Promise<VAccount> {
    const viban = this.generateVIBAN(entity);
    const vAccount = this.vAccountRepo.create({
      viban,
      balance: 0,
      entityType: entity.type,
      entityId: entity.id
    });
    const savedVAccount = await this.vAccountRepo.save(vAccount);
    await this.vAccountLedgerRepo.save({
      vaccount: savedVAccount,
      previousBalance: 0,
      balanceChange: 0,
      operation: VAccountLedgerOperation.Increase,
      newBalance: 0
    });

    return savedVAccount;
  }

  private generateVIBAN(entity: VAccountEntity): string {
    // Simple implementation for illustration purposes
    return createId();
  }
}
