import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

import { PurchaseItemType } from '../purchase-item.constants';

@InputType()
export class AddPurchaseItemInput {
  @Field()
  @IsEnum(PurchaseItemType)
  itemType: PurchaseItemType;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  itemId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  quantity: number;
}
