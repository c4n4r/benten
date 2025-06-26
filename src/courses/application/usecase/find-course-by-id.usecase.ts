import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../shared/domain/identifiant';
import { Course } from '../../domain/course.entity';
import CourseRepositoryInterface from '../../domain/repository/course.repository';

export interface FindCourseByIdCommand {
  id: Identifiant;
}

@Injectable()
export default class FindCourseByIdUseCase extends BaseUseCase<
  FindCourseByIdCommand,
  Course
> {
  constructor(private readonly courseRepository: CourseRepositoryInterface) {
    super();
  }

  async execute(input: FindCourseByIdCommand): Promise<Course> {
    if (!input.id) {
      throw new Error('Course ID is required');
    }
    const course = await this.courseRepository.findById(input.id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }
}
