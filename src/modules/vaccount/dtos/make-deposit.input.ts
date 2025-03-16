import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class MakeDepositInput {
  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  amount: number;
}
