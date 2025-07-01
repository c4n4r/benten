import { Module } from '@nestjs/common';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import DateHelper from '../../../shared/infrastructure/dates/date.helper';
import AddCardToCourseUseCase from '../../application/usecase/cards/add-card-to-course.usecase';
import { CreateCardUseCase } from '../../application/usecase/cards/create-card.usecase';
import FindCardByIdUseCase from '../../application/usecase/cards/find-card-by-id.usecase';
import FindCardsByCourseIdUseCase from '../../application/usecase/cards/find-cards-by-course-id.usecase';
import RemoveCardFromCourseUseCase from '../../application/usecase/cards/remove-card-from-course.usecase';
import CreateCourseUseCase from '../../application/usecase/create-course.usecase';
import FindCourseByIdUseCase from '../../application/usecase/find-course-by-id.usecase';
import UpdateCourseUseCase from '../../application/usecase/update-course.usecase';
import CardRepositoryInterface from '../../domain/repository/card.repository';
import CourseRepositoryInterface from '../../domain/repository/course.repository';
import CardInMemoryRepository from '../../infrastructure/repository/card.in-memory.repository';
import CourseInMemoryRepository from '../../infrastructure/repository/course.in-memory.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CreateCourseUseCase,
    FindCourseByIdUseCase,
    UpdateCourseUseCase,
    CreateCardUseCase,
    FindCardByIdUseCase,
    FindCardsByCourseIdUseCase,
    AddCardToCourseUseCase,
    RemoveCardFromCourseUseCase,
    FindCardByIdUseCase,
    {
      provide: DateHelperInterface,
      useClass: DateHelper,
    },
    {
      provide: CardRepositoryInterface,
      useClass: CardInMemoryRepository,
    },
    {
      provide: CourseRepositoryInterface,
      useClass: CourseInMemoryRepository,
    },
  ],
  exports: [],
})
export default class CourseTestingModule {}
