import { Injectable } from '@nestjs/common';
import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateUserCommand,
  UpdateUserCommand,
} from '../../application/types/user-management.types';
import { User } from '../user.entity';

@Injectable()
export default abstract class UserRepositoryInterface {
  abstract create(user: CreateUserCommand): Promise<User>;
  abstract findById(id: Identifiant): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: Identifiant, user: UpdateUserCommand): Promise<User>;
  abstract delete(id: Identifiant): Promise<void>;
}
