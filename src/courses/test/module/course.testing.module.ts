import { Module } from '@nestjs/common';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import DateHelper from '../../../shared/infrastructure/dates/date.helper';
import CreateCourseUseCase from '../../application/usecase/create-course.usecase';
import FindCourseByIdUseCase from '../../application/usecase/find-course-by-id.usecase';
import UpdateCourseUseCase from '../../application/usecase/update-course.usecase';
import CourseRepositoryInterface from '../../domain/repository/course.repository';
import CourseInMemoryRepository from '../../infrastructure/repository/course.in-memory.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CreateCourseUseCase,
    FindCourseByIdUseCase,
    UpdateCourseUseCase,
    {
      provide: DateHelperInterface,
      useClass: DateHelper,
    },
    {
      provide: CourseRepositoryInterface,
      useClass: CourseInMemoryRepository,
    },
  ],
  exports: [
    CreateCourseUseCase,
    FindCourseByIdUseCase,
    UpdateCourseUseCase,
    CourseRepositoryInterface,
  ],
})
export default class CourseTestingModule {}
