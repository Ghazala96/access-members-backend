import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

import { PaymentReferenceType } from '../payment.constants';

@InputType()
export class ExecutePaymentInput {
  @Field()
  @IsEnum(PaymentReferenceType)
  referenceType: PaymentReferenceType;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  referenceId: number;
}
