import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import UserRepository from '../../domain/repository/user.repository';
import {
  CreateUserCommand,
  CreateUserResponse,
} from '../types/user-management.types';
@Injectable()
export default class CreateUserUseCase extends BaseUseCase<
  CreateUserCommand,
  CreateUserResponse
> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const user = await this.userRepository.create(command);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }
}
