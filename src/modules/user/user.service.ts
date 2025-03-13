import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { hashPassword } from 'src/common/utils';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserInput } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const { firstName, lastName, email, password, role } = data;

    const hashedPassword = await hashPassword(password);
    const selectedRole = await this.roleRepo.findOne({ where: { name: role } });
    if (!selectedRole) {
      throw new BadRequestException('Invalid role');
    }

    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: [selectedRole]
    });

    return this.userRepo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: parseInt(id) } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
