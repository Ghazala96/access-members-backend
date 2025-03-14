import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, Length, IsPositive, IsNumber, IsInt } from 'class-validator';

@InputType()
export class TicketInput {
  @Field()
  @IsString()
  @Length(3, 50)
  type: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than zero' })
  price: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive({ message: 'Quantity must be greater than zero' })
  quantity: number;
}
