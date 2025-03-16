import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { VAccountEntityType } from '../vaccount.constants';

@ObjectType()
@Entity()
export class VAccount extends BaseEntity {
  @Column({ unique: true })
  viban: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  balance: string;

  @Field()
  @Column({ type: 'enum', enum: VAccountEntityType })
  entityType: VAccountEntityType;

  @Field(() => Int)
  @Column({ unique: true })
  entityId: number;
}
