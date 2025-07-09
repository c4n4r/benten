import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserResponse } from '../../application/types/user-management.types';
import CreateUserUseCase from '../../application/usecase/create-user.usecase';
import FindUserUseCase from '../../application/usecase/find-user.usecase';
import UpdateUserUseCase from '../../application/usecase/update-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('authentication')
export default class AuthenticationController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('register')
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
  /*
  @Post('login')
  async loginUser(
    @Body() loginParams: LoginUserDto,
  ): Promise<LoginUserResponse> {
    if (!loginParams) {
      throw new Error('Login parameters are required');
    }
  }
  */
}
