import { Test, TestingModule } from '@nestjs/testing';
import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateCourseCommand } from '../../application/types/courses.types';
import CreateCourseUseCase from '../../application/usecase/create-course.usecase';
import FindCourseByIdUseCase from '../../application/usecase/find-course-by-id.usecase';
import UpdateCourseUseCase from '../../application/usecase/update-course.usecase';
import CourseTestingModule from '../module/course.testing.module';

let testingModule: TestingModule;
describe('Course Management', () => {
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [CourseTestingModule],
    }).compile();
  });

  describe('Course creation', () => {
    it('Should create a new course', async () => {
      const createCourseCommand: CreateCourseCommand = {
        title: 'Test Course',
        description: 'This is a test course',
        ownerId: 'test-owner-id',
      };
      const response = await createSimpleCourse(createCourseCommand);
      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.title).toEqual(createCourseCommand.title);
      expect(response.description).toEqual(createCourseCommand.description);
      expect(response.ownerId).toEqual(createCourseCommand.ownerId);
    });
  });

  describe('Course retrieval', () => {
    it('Should retrieve a course by ID', async () => {
      const course = await createSimpleCourse({
        title: 'Retrieval Course',
        description: 'This course is for retrieval testing',
        ownerId: 'retrieval-owner-id',
      });
      const foundCourse = await findCourseById(course.id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse.id).toEqual(course.id);
      expect(foundCourse.title).toEqual(course.title);
      expect(foundCourse.description).toEqual(course.description);
      expect(foundCourse.ownerId).toEqual(course.ownerId);
    });

    it('Should throw an error if course not found', async () => {
      const invalidId = 'invalid-course-id';
      await expect(findCourseById(invalidId)).rejects.toThrow(
        'Course not found',
      );
    });
  });

  describe('Course update', () => {
    it('Should be able to update a course', async () => {
      const course = await createSimpleCourse({
        title: 'Update Course',
        description: 'This course is for update testing',
        ownerId: 'update-owner-id',
      });

      const updatedCourse = await testingModule
        .get(UpdateCourseUseCase)
        .execute({
          id: course.id,
          title: 'Updated Course Title',
          description: 'Updated Course Description',
        });

      expect(updatedCourse).toBeDefined();
      expect(updatedCourse.id).toEqual(course.id);
      expect(updatedCourse.title).toEqual('Updated Course Title');
      expect(updatedCourse.description).toEqual('Updated Course Description');
    });
    it('Should throw an error if trying to update a non-existing course', async () => {
      const invalidId = 'invalid-course-id';
      await expect(
        testingModule.get(UpdateCourseUseCase).execute({
          id: invalidId,
          title: 'Non-existing Course',
        }),
      ).rejects.toThrow('Course not found');
    });
  });
});

function findCourseById(id: Identifiant) {
  return testingModule.get(FindCourseByIdUseCase).execute({ id });
}

function createSimpleCourse(command?: CreateCourseCommand) {
  const cmd: CreateCourseCommand = {
    title: command?.title || 'Default Course Title',
    description: command?.description || 'Default Course Description',
    ownerId: command?.ownerId || 'default-owner-id',
  };
  return testingModule.get(CreateCourseUseCase).execute(cmd);
}
