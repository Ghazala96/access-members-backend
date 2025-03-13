import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Role extends BaseEntity {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
