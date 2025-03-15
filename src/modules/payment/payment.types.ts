import { User } from '../user/entities/user.entity';
import { ExecutePaymentResponse } from './dtos/execute-payment.response';

export interface PaymentProcessor {
  processPayment(referenceId: number, user: User): Promise<ExecutePaymentResponse>;
}
