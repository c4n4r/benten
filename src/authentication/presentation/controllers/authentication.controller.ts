import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateUserResponse,
  UpdateUserCommand,
} from '../../application/types/user-management.types';
import CreateUserUseCase from '../../application/usecase/create-user.usecase';
import FindUserUseCase from '../../application/usecase/find-user.usecase';
import UpdateUserUseCase from '../../application/usecase/update-user.usecase';
import { User } from '../../domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('authentication')
export default class AuthenticationController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('create')
  async createUser(
    @Body() userCommand: CreateUserDto,
  ): Promise<CreateUserResponse> {
    if (!userCommand) {
      throw new Error('User command is required');
    }
    return this.createUserUseCase.execute({
      firstName: userCommand.firstname,
      lastName: userCommand.lastname,
      email: userCommand.email,
      password: userCommand.password,
      confirmPassword: userCommand.confirmPassword,
      nickname: userCommand.nickname,
    });
  }
  @Get()
  async findUserById(@Param('id') id: Identifiant): Promise<User | null> {
    return this.findUserUseCase.execute(id);
  }

  async updateUser(
    @Param('id') id: Identifiant,
    @Body() updateUserCommand: UpdateUserCommand,
  ): Promise<User> {
    if (!updateUserCommand) {
      throw new Error('Update command is required');
    }

    return this.updateUserUseCase.execute({
      id,
      updateUserCommand,
    });
  }
}
