import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order extends BaseEntity {
  @Column({ type: 'enum', enum: ['Standard', 'Refund'] })
  type: 'Standard' | 'Refund';

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @Column('decimal', { precision: 15, scale: 2 })
  totalPrice: number;

  @Column()
  status: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
