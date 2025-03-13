import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { VAccountModule } from '../vaccount/vaccount.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    JwtModule.register({
      global: true
    }),
    UserModule,
    VAccountModule
  ],
  controllers: [],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}
