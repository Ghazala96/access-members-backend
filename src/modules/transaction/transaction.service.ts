import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './transaction.contants';
import { PaymentReferenceType } from '../payment/payment.constants';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>
  ) {}

  async isReferenceProcessable(
    referenceType: PaymentReferenceType,
    referenceId: number
  ): Promise<boolean> {
    const unprocessableStatuses = [TransactionStatus.Completed, TransactionStatus.Processing];
    const existingTransaction = await this.transactionRepo.findOne({
      where: {
        referenceId,
        referenceType,
        status: In(unprocessableStatuses)
      }
    });

    return !existingTransaction;
  }

  save(transaction: Partial<Transaction>) {
    const createdTransaction = this.transactionRepo.create(transaction);
    return this.transactionRepo.save(createdTransaction);
  }
}
