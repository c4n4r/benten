import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateCourseCommand,
  CreateCourseResponse,
  UpdateCourseCommand,
} from '../../application/types/courses.types';
import { Course } from '../entity/course.entity';

export default abstract class CourseRepositoryInterface {
  abstract create(course: CreateCourseCommand): Promise<CreateCourseResponse>;
  abstract findById(id: Identifiant): Promise<Course | null>;
  abstract findAll(): Promise<Course[]>;
  abstract update(
    id: Identifiant,
    course: UpdateCourseCommand,
  ): Promise<Course>;
  abstract delete(id: Identifiant): Promise<void>;
}
