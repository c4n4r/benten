import { Injectable } from '@nestjs/common';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateCourseCommand,
  UpdateCourseCommand,
} from '../../application/types/courses.types';
import { Course } from '../../domain/course.entity';
import CourseRepositoryInterface from '../../domain/repository/course.repository';

@Injectable()
export default class CourseInMemoryRepository extends CourseRepositoryInterface {
  constructor(private readonly datesHelper: DateHelperInterface) {
    super();
  }

  private courses: Course[] = [];

  async create(course: CreateCourseCommand): Promise<Course> {
    const newCourse = Course.create({
      id: this.generateId(),
      title: course.title,
      description: course.description,
      ownerId: course.ownerId,
      createdAt: this.datesHelper.now(),
    });
    this.courses.push(newCourse);
    return Promise.resolve(newCourse);
  }

  async findById(id: Identifiant): Promise<Course | null> {
    const course = this.courses.find((course) => course.id === id);
    return Promise.resolve(course || null);
  }

  async findAll(): Promise<Course[]> {
    return Promise.resolve(this.courses);
  }

  delete(id: Identifiant): Promise<void> {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  async update(id: Identifiant, course: UpdateCourseCommand): Promise<any> {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index !== -1) {
      const updatedCourse: Course = {
        ...this.courses[index],
        ...course,
      };
      this.courses[index] = updatedCourse;
      return Promise.resolve(updatedCourse);
    }
    return Promise.reject(new Error('Course not found'));
  }

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(2); // Simple ID generation for demonstration
  }
}
