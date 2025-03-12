import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { eager: true })
  order: Order;

  @Column({ type: 'enum', enum: ['Ticket'] })
  itemType: 'Ticket';

  @Column()
  itemId: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
}
