import { Injectable, BadRequestException } from '@nestjs/common';

import { User } from 'src/modules/user/entities/user.entity';
import { OrderStatus } from 'src/modules/order/order.constants';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { VAccountService } from 'src/modules/vaccount/vaccount.service';
import {
  TransactionSrcAndDestType,
  TransactionStatus,
  TransactionType
} from 'src/modules/transaction/transaction.contants';
import { OrderService } from '../../order/order.service';
import { ExecutePaymentResponse } from '../dtos/execute-payment.response';
import { PaymentProcessor } from '../payment.types';
import { PaymentReferenceType } from '../payment.constants';
import { VAccountEntityType } from 'src/modules/vaccount/vaccount.constants';

@Injectable()
export class OrderPaymentProcessor implements PaymentProcessor {
  constructor(
    private readonly orderService: OrderService,
    private readonly transactionService: TransactionService,
    private readonly vAccountService: VAccountService
  ) {}

  // Assume vaccount payment is the only payment method
  async processPayment(orderId: number, user: User): Promise<ExecutePaymentResponse> {
    const order = await this.orderService.findOne({
      where: {
        id: orderId,
        createdBy: { id: user.id },
        status: OrderStatus.Created
      },
      relations: ['event']
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const canProcessPayment = await this.transactionService.isReferenceProcessable(
      PaymentReferenceType.Order,
      orderId
    );
    if (!canProcessPayment) {
      throw new BadRequestException('Payment is already completed or processing.');
    }

    const sourceVAccount = await this.vAccountService.findByEntity(
      VAccountEntityType.User,
      user.id
    );
    const destinationVAccount = await this.vAccountService.findByEntity(
      VAccountEntityType.Event,
      order.event.id
    );
    const amount = order.totalPrice;

    const srcBalanceInCents = Math.round(parseFloat(sourceVAccount.balance) * 100);
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (srcBalanceInCents < amountInCents) {
      throw new BadRequestException('Insufficient balance to execute payment');
    }

    const transaction = await this.transactionService.save({
      type: TransactionType.Payment,
      amount,
      sourceType: TransactionSrcAndDestType.VAccount,
      source: sourceVAccount.viban,
      destType: TransactionSrcAndDestType.VAccount,
      dest: destinationVAccount.viban,
      status: TransactionStatus.Completed,
      referenceType: PaymentReferenceType.Order,
      referenceId: orderId
    });
    await this.vAccountService.transferAmount(
      sourceVAccount,
      destinationVAccount,
      amount,
      transaction
    );
    await this.orderService.updateOrderStatus(order, OrderStatus.Completed);

    return { transactionId: transaction.id, transactionStatus: transaction.status };
  }
}
