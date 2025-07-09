import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../shared/domain/identifiant';
import { Course } from '../../domain/entity/course.entity';
import CourseRepositoryInterface from '../../domain/repository/course.repository';

export interface UpdateCourseCommand {
  id: Identifiant;
  title?: string;
  description?: string;
  ownerId?: Identifiant;
}

@Injectable()
export default class UpdateCourseUseCase extends BaseUseCase<
  UpdateCourseCommand,
  Course
> {
  constructor(private readonly courseRepository: CourseRepositoryInterface) {
    super();
  }
  async execute(input: UpdateCourseCommand): Promise<Course> {
    if (!input.id) {
      throw new Error('Course ID is required');
    }

    const course = await this.courseRepository.findById(input.id);
    if (!course) {
      throw new Error('Course not found');
    }

    const updatedCourse = Course.create({
      ...course,
      title: input.title ?? course.title,
      description: input.description ?? course.description,
      ownerId: input.ownerId ?? course.ownerId,
    });

    await this.courseRepository.update(updatedCourse.id, input);
    return updatedCourse;
  }
}
