import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { ExecutePaymentInput } from './dtos/execute-payment.input';
import { DecodedAuthToken } from '../auth/auth.types';
import { ExecutePaymentResponse } from './dtos/execute-payment.response';
import { PaymentProcessorFactory } from './processors/payment-processor.factory';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentProcessorFactory: PaymentProcessorFactory,
    private readonly userService: UserService
  ) {}

  async executePayment(
    input: ExecutePaymentInput,
    decoded: DecodedAuthToken
  ): Promise<ExecutePaymentResponse> {
    const { referenceId, referenceType } = input;

    const user = await this.userService.validateUser(decoded.sub);
    const paymentProcessor = this.paymentProcessorFactory.getProcessor(referenceType);
    return paymentProcessor.processPayment(referenceId, user);
  }
}
