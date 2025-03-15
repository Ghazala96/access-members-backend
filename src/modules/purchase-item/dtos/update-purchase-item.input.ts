import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdatePurchaseItemInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  quantity: number;
}
