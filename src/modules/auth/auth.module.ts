import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { VAccountModule } from '../vaccount/vaccount.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true
    }),
    UserModule,
    VAccountModule
  ],
  controllers: [],
  providers: [AuthResolver, AuthService]
})
export class AuthModule {}
