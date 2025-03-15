import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';
import { PaymentService } from './payment.service';
import { ExecutePaymentInput } from './dtos/execute-payment.input';
import { ExecutePaymentResponse } from './dtos/execute-payment.response';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => ExecutePaymentResponse)
  async executePayment(
    @Args('input') input: ExecutePaymentInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<ExecutePaymentResponse> {
    return this.paymentService.executePayment(input, decoded);
  }
}
