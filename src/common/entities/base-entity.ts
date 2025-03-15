import { Field, ObjectType, ID } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
