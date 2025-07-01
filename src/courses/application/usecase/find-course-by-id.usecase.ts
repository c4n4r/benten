import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../shared/domain/identifiant';
import { Card } from '../../domain/card.entity';
import CourseAggregate from '../../domain/course.aggregate.entity';
import { Course } from '../../domain/course.entity';
import CardRepositoryInterface from '../../domain/repository/card.repository';
import CourseRepositoryInterface from '../../domain/repository/course.repository';

export interface FindCourseByIdCommand {
  id: Identifiant;
}

@Injectable()
export default class FindCourseByIdUseCase extends BaseUseCase<
  FindCourseByIdCommand,
  CourseAggregate
> {
  constructor(
    private readonly cardRepository: CardRepositoryInterface,
    private readonly courseRepository: CourseRepositoryInterface,
  ) {
    super();
  }

  async execute(input: FindCourseByIdCommand): Promise<CourseAggregate> {
    if (!input.id) {
      throw new Error('Course ID is required');
    }
    const { course, cards } = await this.aggregateData(input);
    if (!course) {
      throw new Error('Course not found');
    }
    return CourseAggregate.create(course, cards);
  }

  private async aggregateData(
    input: FindCourseByIdCommand,
  ): Promise<{ course: Course | null; cards: Card[] }> {
    const course = await this.courseRepository.findById(input.id);
    const cards = await this.cardRepository.findByCourseId(input.id);
    return { course, cards };
  }
}
