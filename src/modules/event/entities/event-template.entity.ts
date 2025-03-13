import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from '../../user/entities/user.entity';
import { Event } from './event.entity';

@ObjectType()
@Entity()
export class EventTemplate extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.eventTemplates, { eager: true })
  createdBy: User;

  @Field(() => [Event], { nullable: true }) //FIXME: Remove nullable true
  @OneToMany(() => Event, (event) => event.template, { cascade: true })
  events: Event[];
}
