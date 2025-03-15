import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { hashPassword } from 'src/common/utils';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleTag } from './entities/role-tag.entity';
import { CreateUserInput } from './user.types';
import { UserRole } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(RoleTag) private readonly roleTagRepo: Repository<RoleTag>
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const { firstName, lastName, email, password, roleTags } = data;

    const hashedPassword = await hashPassword(password);
    const selectedRole = await this.roleRepo.findOne({
      where: { name: UserRole.User }
    });
    if (!selectedRole) {
      throw new InternalServerErrorException(
        `Default role ${UserRole.User} is missing. Please check database seeding.`
      );
    }

    const selectedRoleTags = await this.roleTagRepo.find({
      where: { name: In(roleTags) }
    });
    if (selectedRoleTags.length !== roleTags.length) {
      throw new BadRequestException('Invalid role tags');
    }

    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: selectedRole,
      roleTags: selectedRoleTags
    });
    const savedUser = await this.userRepo.save(user);

    return savedUser;
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: parseInt(id) } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
