import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import { MongodbModule } from '../../../shared/infrastructure/database/mongodb/mongodb.module';
import DateHelper from '../../../shared/infrastructure/dates/date.helper';
import PasswordHasherService from '../../../shared/infrastructure/password/password-hasher.service';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { UserDocument, UserSchema } from '../repository/schemas/user.schema';
import UserMongodbRepository from '../repository/user.mongodb.repository';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [
    PasswordHasherService,
    {
      provide: UserRepositoryInterface,
      useClass: UserMongodbRepository,
    },
    {
      provide: DateHelperInterface,
      useClass: DateHelper,
    },
  ],
  exports: [UserRepositoryInterface],
})
export class UserMongodbModule {}
