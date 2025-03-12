import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { VAccount } from './vaccount.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class VAccountLedger extends BaseEntity {
  @ManyToOne(() => VAccount, { eager: true })
  vaccount: VAccount;

  @Column()
  previousBalance: number;

  @Column()
  balanceChange: number;

  @Column({ type: 'enum', enum: ['+', '-'] })
  operation: '+' | '-';

  @Column()
  newBalance: number;

  @ManyToOne(() => Transaction, { eager: true })
  transaction: Transaction;
}
