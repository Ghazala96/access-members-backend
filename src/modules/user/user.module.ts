import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleTag } from './entities/role-tag.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RoleTag])],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}
