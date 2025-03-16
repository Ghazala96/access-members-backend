import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Repository } from 'typeorm';

import { VAccount } from './entities/vaccount.entity';
import { VAccountLedger } from './entities/vaccount-ledger.entity';
import { VAccountEntity } from './vaccount.types';
import { VAccountLedgerOperation } from './vaccount.constants';
import { Transaction } from '../transaction/entities/transaction.entity';
import { UserService } from '../user/user.service';
import { DecodedAuthToken } from '../auth/auth.types';
import { MakeDepositInput } from './dtos/make-deposit.input';

@Injectable()
export class VAccountService {
  constructor(
    @InjectRepository(VAccount) private readonly vAccountRepo: Repository<VAccount>,
    @InjectRepository(VAccountLedger)
    private readonly vAccountLedgerRepo: Repository<VAccountLedger>,
    private readonly userService: UserService
  ) {}

  async createVAccount(entity: VAccountEntity): Promise<VAccount> {
    const existingVAccount = await this.vAccountRepo.findOne({ where: { entityId: entity.id } });
    if (existingVAccount) {
      return existingVAccount;
    }

    const viban = this.generateVIBAN(entity);
    const formattedZero = (0).toFixed(2);
    const vAccount = this.vAccountRepo.create({
      viban,
      balance: formattedZero,
      entityType: entity.type,
      entityId: entity.id
    });
    const savedVAccount = await this.vAccountRepo.save(vAccount);
    await this.vAccountLedgerRepo.save({
      vaccount: savedVAccount,
      previousBalance: formattedZero,
      balanceChange: formattedZero,
      operation: VAccountLedgerOperation.Increase,
      newBalance: formattedZero
    });

    return savedVAccount;
  }

  async makeDeposit(input: MakeDepositInput, decoded: DecodedAuthToken): Promise<boolean> {
    const { amount } = input;

    const user = await this.userService.validateUser(decoded.sub);
    const vAccount = await this.vAccountRepo.findOne({ where: { entityId: user.id } });
    if (!vAccount) {
      throw new NotFoundException('Virtual account not found');
    }

    const currentBalanceFloat = parseFloat(vAccount.balance);
    const newBalanceFloat = currentBalanceFloat + amount;
    const newBalance = newBalanceFloat.toFixed(2);
    vAccount.balance = newBalance;
    const savedVAccount = await this.vAccountRepo.save(vAccount);
    const ledgerEntry = this.vAccountLedgerRepo.create({
      vaccount: savedVAccount,
      previousBalance: currentBalanceFloat.toFixed(2),
      balanceChange: amount.toFixed(2),
      operation: VAccountLedgerOperation.Increase,
      newBalance
    });
    await this.vAccountLedgerRepo.save(ledgerEntry);

    return true;
  }

  transferAmount(src: VAccount, dest: VAccount, amount: string, transaction: Transaction) {
    const amountFloat = parseFloat(amount);
    const srcBalanceFloat = parseFloat(src.balance);
    const newSrcBalanceFloat: number = srcBalanceFloat - amountFloat;
    const srcLedgerEntry = this.vAccountLedgerRepo.create({
      vaccount: src,
      previousBalance: src.balance,
      balanceChange: amount,
      operation: VAccountLedgerOperation.Decrease,
      newBalance: newSrcBalanceFloat.toFixed(2),
      transaction
    });
    const destBalanceFloat: number = parseFloat(dest.balance);
    const newDestBalanceFloat: number = destBalanceFloat + amountFloat;
    const destLedgerEntry = this.vAccountLedgerRepo.create({
      vaccount: dest,
      previousBalance: dest.balance,
      balanceChange: amount,
      operation: VAccountLedgerOperation.Increase,
      newBalance: newDestBalanceFloat.toFixed(2),
      transaction
    });
    src.balance = newSrcBalanceFloat.toFixed(2);
    dest.balance = newDestBalanceFloat.toFixed(2);
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
