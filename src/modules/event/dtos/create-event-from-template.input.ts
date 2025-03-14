import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsDateString, IsPositive } from 'class-validator';

import { IsFutureDate } from 'src/common/decorators/validation/is-future-date.decorator';

@InputType()
export class CreateEventFromTemplateInput {
  @Field()
  @IsDateString({ strict: true }, { message: 'Date must be a valid ISO 8601 string' })
  @IsFutureDate()
  date: string;
}
