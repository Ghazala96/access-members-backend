import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { VAccount } from './vaccount.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { VAccountLedgerOperation } from '../vaccount.constants';

@ObjectType()
@Entity()
export class VAccountLedger extends BaseEntity {
  @Field(() => VAccount)
  @ManyToOne(() => VAccount, { eager: true })
  vaccount: VAccount;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  previousBalance: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  balanceChange: number;

  @Column({ type: 'enum', enum: VAccountLedgerOperation })
  operation: VAccountLedgerOperation;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  newBalance: number;

  @Field(() => Transaction)
  @ManyToOne(() => Transaction)
  transaction: Transaction;
}
