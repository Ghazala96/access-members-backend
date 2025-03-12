import { Entity, Column } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';

@Entity()
export class Transaction extends BaseEntity {
  @Column()
  type: string;

  @Column()
  businessType: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  sourceType: string;

  @Column()
  source: string;

  @Column()
  destType: string;

  @Column()
  dest: string;

  @Column({ nullable: true })
  externalTransactionId: string;

  @Column()
  status: string;
}
