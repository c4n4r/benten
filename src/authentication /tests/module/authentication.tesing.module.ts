import { Module } from '@nestjs/common';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import DateHelper from '../../../shared/infrastructure/dates/date.helper';
import CreateUserUseCase from '../../application /usecase/create-user.usecase';
import FindUserUseCase from '../../application /usecase/find-user.usecase';
import UpdateUserUseCase from '../../application /usecase/update-user.usecase';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import UserInMemoryRepository from '../../infrastructure/repository/user.in-memory.repository';
import { _now } from '../unit/user-management.spec';

@Module({
  providers: [
    {
      provide: DateHelperInterface,
      useClass: class extends DateHelper {
        now(): Date {
          return _now;
        }
      },
    },
    {
      provide: UserRepositoryInterface,
      useClass: UserInMemoryRepository,
    },
    CreateUserUseCase,
    FindUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [CreateUserUseCase, FindUserUseCase, UpdateUserUseCase],
})
export default class AuthenticationTestingModule {}
