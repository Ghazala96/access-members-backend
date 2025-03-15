import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Repository } from 'typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';
import { VAccountEntity } from './vaccount.types';
import { VAccountLedgerOperation } from './vaccount.constants';
import { Transaction } from '../transaction/entities/transaction.entity';

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

  transferAmount(src: VAccount, dest: VAccount, amount: number, transaction: Transaction) {
    const srcLedgerEntry = this.vAccountLedgerRepo.create({
      vaccount: src,
      previousBalance: src.balance,
      balanceChange: amount,
      operation: VAccountLedgerOperation.Decrease,
      newBalance: src.balance - amount,
      transaction
    });
    const destLedgerEntry = this.vAccountLedgerRepo.create({
      vaccount: dest,
      previousBalance: dest.balance,
      balanceChange: amount,
      operation: VAccountLedgerOperation.Increase,
      newBalance: dest.balance + amount,
      transaction
    });
    src.balance -= amount;
    dest.balance += amount;
    const saveVAccountsPromise = this.vAccountRepo.save([src, dest]);
    const saveLedgerEntriesPromise = this.vAccountLedgerRepo.save([
      srcLedgerEntry,
      destLedgerEntry
    ]);
    return Promise.all([saveVAccountsPromise, saveLedgerEntriesPromise]);
  }

  private generateVIBAN(entity: VAccountEntity): string {
    // Simple implementation for illustration purposes
    return createId();
  }

  async findByEntityId(entityId: number): Promise<VAccount> {
    return this.vAccountRepo.findOne({ where: { entityId } });
  }
}
