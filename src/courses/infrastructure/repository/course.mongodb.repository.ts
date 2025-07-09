import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateCourseCommand } from '../../application/types/courses.types';
import { Course } from '../../domain/entity/course.entity';
import CourseRepositoryInterface from '../../domain/repository/course.repository';
import { CourseDocument } from './schemas/course.schema';

@Injectable()
export default class CourseMongodbRepository extends CourseRepositoryInterface {
  constructor(
    @InjectModel(CourseDocument.name)
    private courseModel: Model<CourseDocument>,
  ) {
    super();
  }

  async create(course: CreateCourseCommand): Promise<Course> {
    const id = this.generateId();
    const createdCourse = new this.courseModel({
      _id: id,
      title: course.title,
      description: course.description,
      ownerId: course.ownerId,
      createdAt: new Date(),
    });

    const savedCourse = await createdCourse.save();

    return Course.create({
      id: savedCourse._id as Identifiant,
      title: savedCourse.title,
      description: savedCourse.description,
      ownerId: savedCourse.ownerId as Identifiant,
      createdAt: savedCourse.createdAt,
    });
  }

  async findById(id: Identifiant): Promise<Course | null> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) {
      return null;
    }

    return Course.create({
      id: course._id as Identifiant,
      title: course.title,
      description: course.description,
      ownerId: course.ownerId as Identifiant,
      createdAt: course.createdAt,
    });
  }

  async findByOwnerId(ownerId: Identifiant): Promise<Course[]> {
    const courses = await this.courseModel.find({ ownerId }).exec();

    return courses.map((course) =>
      Course.create({
        id: course._id as Identifiant,
        title: course.title,
        description: course.description,
        ownerId: course.ownerId as Identifiant,
        createdAt: course.createdAt,
      }),
    );
  }

  async update(id: Identifiant, course: Course): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(
        id,
        {
          title: course.title,
          description: course.description,
        },
        { new: true },
      )
      .exec();

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return Course.create({
      id: updatedCourse._id as Identifiant,
      title: updatedCourse.title,
      description: updatedCourse.description,
      ownerId: updatedCourse.ownerId as Identifiant,
      createdAt: updatedCourse.createdAt,
    });
  }

  async delete(id: Identifiant): Promise<void> {
    const result = await this.courseModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new Error('Course not found');
    }
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.courseModel.find().exec();

    return courses.map((course) =>
      Course.create({
        id: course._id as Identifiant,
        title: course.title,
        description: course.description,
        ownerId: course.ownerId as Identifiant,
        createdAt: course.createdAt,
      }),
    );
  }

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(2);
  }
}
