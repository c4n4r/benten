import { Injectable, NotFoundException } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../shared/domain/identifiant';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { User } from '../../domain/user.entity';

@Injectable()
export default class FindUserUseCase extends BaseUseCase<string, User> {
  constructor(private readonly userRepository: UserRepositoryInterface) {
    super();
  }

  async execute(userId: Identifiant): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}
