import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { VAccount } from './vaccount.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { VAccountLedgerOperation } from '../vaccount.constants';

@Entity()
export class VAccountLedger extends BaseEntity {
  @ManyToOne(() => VAccount)
  vaccount: VAccount;

  @Column('decimal', { precision: 10, scale: 2 })
  previousBalance: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balanceChange: string;

  @Column({ type: 'enum', enum: VAccountLedgerOperation })
  operation: VAccountLedgerOperation;

  @Column('decimal', { precision: 10, scale: 2 })
  newBalance: string;

  @ManyToOne(() => Transaction)
  transaction: Transaction;
}
