import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';

//TODO: Define enums
@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  reason: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  sourceType: string;

  @Field()
  @Column()
  source: string;

  @Field()
  @Column()
  destType: string;

  @Field()
  @Column()
  dest: string;

  @Field()
  @Column({ nullable: true })
  externalTransactionId: string;

  @Field()
  @Column()
  status: string;
}
