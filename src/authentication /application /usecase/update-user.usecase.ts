import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../shared/domain/identifiant';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { User } from '../../domain/user.entity';
import { UpdateUserCommand } from '../types/user-management.types';

export type UpdateUserInput = {
  id: Identifiant;
  updateUserCommand: UpdateUserCommand;
};
@Injectable()
export default class UpdateUserUseCase extends BaseUseCase<
  UpdateUserInput,
  User
> {
  constructor(private readonly userRepository: UserRepositoryInterface) {
    super();
  }
  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new Error(`User with ID ${input.id} not found`);
    }
    return this.userRepository.update(input.id, input.updateUserCommand);
  }
}
