import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';

@Entity()
export class VAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  viban: string;

  @Column('decimal', { precision: 15, scale: 2 })
  balance: number;

  @Column({ type: 'enum', enum: ['User', 'Event'] })
  entityType: 'User' | 'Event';

  @Column()
  entityId: number;
}
