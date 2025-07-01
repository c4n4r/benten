import { Module } from '@nestjs/common';
import AddCardToCourseUseCase from './usecase/cards/add-card-to-course.usecase';
import { CreateCardUseCase } from './usecase/cards/create-card.usecase';
import FindCardByIdUseCase from './usecase/cards/find-card-by-id.usecase';
import FindCardsByCourseIdUseCase from './usecase/cards/find-cards-by-course-id.usecase';
import CreateCourseUseCase from './usecase/create-course.usecase';
import FindCourseByIdUseCase from './usecase/find-course-by-id.usecase';
import UpdateCourseUseCase from './usecase/update-course.usecase';

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
    FindCardByIdUseCase,
  ],
  exports: [
    CreateCourseUseCase,
    FindCourseByIdUseCase,
    UpdateCourseUseCase,
    CreateCardUseCase,
    FindCardByIdUseCase,
    FindCardsByCourseIdUseCase,
    AddCardToCourseUseCase,
    FindCardByIdUseCase,
  ],
})
export default class CourseModule {}
