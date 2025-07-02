import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from '../../../shared/infrastructure/database/mongodb/mongodb.module';
import CourseRepositoryInterface from '../../domain/repository/course.repository';
import CourseMongodbRepository from '../repository/course.mongodb.repository';
import {
  CourseDocument,
  CourseSchema,
} from '../repository/schemas/course.schema';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
    ]),
  ],
  providers: [
    {
      provide: CourseRepositoryInterface,
      useClass: CourseMongodbRepository,
    },
  ],
  exports: [CourseRepositoryInterface],
})
export class CourseMongodbModule {}
