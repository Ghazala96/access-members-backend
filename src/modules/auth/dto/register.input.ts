import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';

import { IsStrongPassword } from 'src/common/decorators/validation/is-strong-password.decorator';
import { MinNameLength, UserRole } from 'src/modules/user/user.constants';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(MinNameLength)
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  firstName: string;

  @Field()
  @IsString()
  @MinLength(MinNameLength)
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  @IsStrongPassword() // Checks password strength using zxcvbn even if it passes regex e.g. Password1!, Welcome123!..etc
  password: string;

  @Field()
  @IsEnum(UserRole)
  role: UserRole;
}
