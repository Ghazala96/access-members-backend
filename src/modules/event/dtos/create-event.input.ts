import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsString, Length } from 'class-validator';

import { IsFutureDate } from 'src/common/decorators/validation/is-future-date.decorator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @Length(3, 100)
  name: string;

  @Field()
  @IsString()
  @Length(10, 500)
  description: string;

  @Field()
  @IsDateString({ strict: true }, { message: 'Date must be a valid ISO 8601 string' })
  @IsFutureDate()
  date: string;
}
