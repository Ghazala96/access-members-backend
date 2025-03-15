import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ExecutePaymentResponse {
  @Field(() => Int)
  transactionId: number;

  @Field()
  transactionStatus: string;
}
