import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { VAccountModule } from '../vaccount/vaccount.module';
import { TransactionModule } from '../transaction/transaction.module';
import { OrderModule } from '../order/order.module';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentProcessorFactory } from './processors/payment-processor.factory';
import { OrderPaymentProcessor } from './processors/order-payment.processor';

@Module({
  imports: [UserModule, VAccountModule, TransactionModule, OrderModule],
  providers: [PaymentResolver, PaymentService, PaymentProcessorFactory, OrderPaymentProcessor]
})
export class PaymentModule {}
