import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from '../../user/entities/user.entity';
import { Event } from './event.entity';

@Entity()
export class EventTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.eventTemplates, { eager: true })
  createdBy: User;

  @OneToMany(() => Event, (event) => event.template, { cascade: true })
  events: Event[];
}
