import { ObjectType } from '@nestjs/graphql';
import { DeleteDateColumn } from 'typeorm';

import { BaseEntity } from './base-entity';

@ObjectType()
export abstract class DeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
