import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, Unique } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import {
  TransactionSrcAndDestType,
  TransactionStatus,
  TransactionType
} from '../transaction.contants';

@ObjectType()
@Entity()
@Unique(['referenceId', 'status'])
export class Transaction extends BaseEntity {
  @Field()
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Field()
  @Column({ type: 'enum', enum: TransactionSrcAndDestType })
  sourceType: TransactionSrcAndDestType;

  @Field()
  @Column()
  source: string;

  @Field()
  @Column({ type: 'enum', enum: TransactionSrcAndDestType })
  destType: TransactionSrcAndDestType;

  @Field()
  @Column()
  dest: string;

  @Field()
  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Field()
  @Column()
  referenceType: string;

  @Field()
  @Column()
  referenceId: number;

  @Column({ nullable: true })
  externalTransactionId?: string;
}
