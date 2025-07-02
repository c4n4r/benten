import { Module } from '@nestjs/common';
import CreateUserUseCase from './application/usecase/create-user.usecase';
import FindUserUseCase from './application/usecase/find-user.usecase';
import UpdateUserUseCase from './application/usecase/update-user.usecase';
import { UserMongodbModule } from './infrastructure/mongodb/user-mongodb.module';
import AuthenticationController from './presentation/controllers/authentication.controller';

@Module({
  imports: [UserMongodbModule],
  controllers: [AuthenticationController],
  providers: [CreateUserUseCase, FindUserUseCase, UpdateUserUseCase],
  exports: [],
})
export default class AuthenticationModule {}
