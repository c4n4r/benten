import { Injectable } from '@nestjs/common';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateUserCommand,
  UpdateUserCommand,
} from '../../application /types/user-management.types';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { User } from '../../domain/user.entity';
@Injectable()
export default class UserInMemoryRepository implements UserRepositoryInterface {
  constructor(
    private readonly dateHelper: DateHelperInterface, // Assuming DateHelperInterface is injected for date handling
  ) {}

  create(user: CreateUserCommand): Promise<User> {
    const newUser = User.create({
      id: this.generateId(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      nickname: user.nickname,
      createdAt: this.dateHelper.now(),
    });
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }
  findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return Promise.resolve(user || null);
  }
  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
  update(id: Identifiant, user: UpdateUserCommand): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updatedUser = User.create({
        ...this.users[index],
        ...user,
      });
      this.users[index] = updatedUser;
      return Promise.resolve(updatedUser);
    }
    return Promise.reject(new Error('User not found'));
  }
  delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error('User not found'));
  }

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(2); // Simple ID generation for demonstration
  }

  private users: User[] = [];
}
