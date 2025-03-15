import { Injectable, BadRequestException } from '@nestjs/common';

import { OrderPaymentProcessor } from './order-payment.processor';
import { PaymentReferenceType } from '../payment.constants';

@Injectable()
export class PaymentProcessorFactory {
  constructor(private readonly orderPaymentProcessor: OrderPaymentProcessor) {}

  getProcessor(referenceType: PaymentReferenceType) {
    switch (referenceType) {
      case PaymentReferenceType.Order:
        return this.orderPaymentProcessor;
      default:
        throw new BadRequestException('Unsupported reference type');
    }
  }
}
