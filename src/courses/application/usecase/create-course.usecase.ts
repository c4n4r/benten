import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../shared/application/usecase/base.usecase';
import CourseRepositoryInterface from '../../domain/repository/course.repository';
import {
  CreateCourseCommand,
  CreateCourseResponse,
} from '../types/courses.types';

@Injectable()
export default class CreateCourseUseCase extends BaseUseCase<
  CreateCourseCommand,
  CreateCourseResponse
> {
  constructor(private readonly courseRepository: CourseRepositoryInterface) {
    super();
  }
  async execute(input: CreateCourseCommand) {
    return await this.courseRepository.create(input);
  }
}
