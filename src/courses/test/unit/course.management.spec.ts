import { Test, TestingModule } from '@nestjs/testing';
import { Identifiant } from '../../../shared/domain/identifiant';
import {
  CreateCourseCommand,
  CreateCourseResponse,
} from '../../application/types/courses.types';
import AddCardToCourseUseCase from '../../application/usecase/cards/add-card-to-course.usecase';
import {
  CreateCardCommand,
  CreateCardUseCase,
} from '../../application/usecase/cards/create-card.usecase';
import FindCardByIdUseCase from '../../application/usecase/cards/find-card-by-id.usecase';
import FindCardsByCourseIdUseCase from '../../application/usecase/cards/find-cards-by-course-id.usecase';
import RemoveCardFromCourseUseCase from '../../application/usecase/cards/remove-card-from-course.usecase';
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
    it('Should retrieve a course by ID with all related cards', async () => {
      const course = await createSimpleCourse({
        title: 'Course with Cards',
        description: 'This course has related cards',
        ownerId: 'cards-owner-id',
      });
      const card1 = await createSimpleCard({
        title: 'Card 1 for Course',
        content: 'Content for Card 1',
        courseIds: [course.id],
        createdBy: 'cards-owner-id', // Ajout explicite du createdBy
      });
      const card2 = await createSimpleCard({
        title: 'Card 2 for Course',
        content: 'Content for Card 2',
        courseIds: [course.id],
        createdBy: 'cards-owner-id', // Ajout explicite du createdBy
      });
      const foundCourse = await findCourseById(course.id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse.id).toEqual(course.id);
      expect(foundCourse.title).toEqual(course.title);
      expect(foundCourse.description).toEqual(course.description);
      expect(foundCourse.ownerId).toEqual(course.ownerId);
      expect(foundCourse.cards).toBeDefined();
      expect(foundCourse.cards.length).toBeGreaterThanOrEqual(2);
      expect(foundCourse.cards).toContainEqual(card1);
      expect(foundCourse.cards).toContainEqual(card2);
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
  describe('Card management in courses', () => {
    describe('Cards management', () => {
      it('Should be able to create a Card', async () => {
        const card = await createSimpleCard({
          title: 'Test Card',
          content: 'This is a test card content',
          createdBy: 'user-1', // Ajout explicite du createdBy
        });
        expect(card).toBeDefined();
        expect(card.title).toEqual('Test Card');
        expect(card.content).toEqual('This is a test card content');
        expect(card.createdBy).toEqual('user-1'); // Vérification du createdBy
      });
      it('Should be able to get a Card by ID', async () => {
        const card = await createSimpleCard({
          title: 'Retrieval Card',
          content: 'This card is for retrieval testing',
          createdBy: 'user-2', // Ajout explicite du createdBy
        });
        const foundCard = await testingModule
          .get(FindCardByIdUseCase)
          .execute(card.id);
        expect(foundCard).toBeDefined();
        expect(foundCard.id).toEqual(card.id);
        expect(foundCard.title).toEqual(card.title);
        expect(foundCard.content).toEqual(card.content);
        expect(foundCard.createdBy).toEqual('user-2'); // Vérification du createdBy
      });
      it('Should be able to create a Card affiliated to a Course', async () => {
        const course = await createSimpleCourse();
        const card = await createSimpleCard({
          title: 'Card for Course',
          content: 'Affiliated card',
          courseIds: [course.id],
          createdBy: 'user-3', // Ajout explicite du createdBy
        });
        expect(card).toBeDefined();
        expect(card.title).toEqual('Card for Course');
        expect(card.content).toEqual('Affiliated card');
        expect(card.courseIds).toContain(course.id);
        expect(card.createdBy).toEqual('user-3'); // Vérification du createdBy
      });

      it('Should throw an error if trying to get a non-existing Card', async () => {
        const invalidId = 'invalid-card-id';
        await expect(
          testingModule.get(FindCardByIdUseCase).execute(invalidId),
        ).rejects.toThrow('Card not found');
      });

      it('Should be able to find Cards by Course ID', async () => {
        const course = await createSimpleCourse({
          title: 'Course with Cards',
          description: 'This course has multiple cards',
          ownerId: 'course-owner-id',
        });

        const card1 = await createSimpleCard({
          title: 'Card 1 for Course',
          content: 'Content for Card 1',
          courseIds: [course.id],
        });
        const card2 = await createSimpleCard({
          title: 'Card 2 for Course',
          content: 'Content for Card 2',
          courseIds: [course.id],
        });

        const cards = await testingModule
          .get(FindCardsByCourseIdUseCase)
          .execute(course.id);
        expect(cards).toBeDefined();
        expect(cards.length).toBeGreaterThanOrEqual(2);
        expect(cards).toContainEqual(card1);
        expect(cards).toContainEqual(card2);
      });

      it('Should return an empty array if no Cards are found for a Course', async () => {
        const course = await createSimpleCourse({
          title: 'Empty Course',
          description: 'This course has no cards',
          ownerId: 'empty-course-owner-id',
        });

        const cards = await testingModule
          .get(FindCardsByCourseIdUseCase)
          .execute(course.id);
        expect(cards).toBeDefined();
        expect(cards.length).toBe(0);
      });
      it('Should add a Card to an existing Course', async () => {
        const course = await createSimpleCourse({
          title: 'Course for Card Addition',
          description: 'This course will have a card added',
          ownerId: 'card-addition-owner-id',
        });
        const card = await createSimpleCard({
          title: 'New Card for Existing Course',
          content: 'Content for new card',
          courseIds: [],
          createdBy: 'card-addition-owner-id',
        });
        expect(card.courseIds).not.toContain(course.id);
        const updatedCard = await testingModule
          .get(AddCardToCourseUseCase)
          .execute({
            cardId: card.id,
            courseId: course.id,
            userId: 'card-addition-owner-id',
          });
        expect(updatedCard).toBeDefined();
        expect(updatedCard.id).toEqual(card.id);
        expect(updatedCard.courseIds).toContain(course.id);
        const retrievedCard = await testingModule
          .get(FindCardByIdUseCase)
          .execute(card.id);
        expect(retrievedCard.courseIds).toContain(course.id);
      });
      it('Should throw an error if trying to add a Card to a non-existing Course', async () => {
        const invalidCourseId = 'invalid-course-id';
        const card = await createSimpleCard({
          title: 'Card for Non-existing Course',
          content: 'This card should not be added',
          createdBy: 'test-user-id',
        });
        await expect(
          testingModule.get(AddCardToCourseUseCase).execute({
            cardId: card.id,
            courseId: invalidCourseId,
            userId: 'test-user-id',
          }),
        ).rejects.toThrow('Course not found');
      });
      it('Should remove an existing Card from a Course', async () => {
        const course = await createSimpleCourse({
          title: 'Course for Card Removal',
          description: 'This course will have a card removed',
          ownerId: 'card-removal-owner-id',
        });
        const card = await createSimpleCard({
          title: 'Card to be Removed',
          content: 'Content for card to be removed',
          courseIds: [course.id],
          createdBy: 'card-removal-owner-id',
        });
        expect(card.courseIds).toContain(course.id);
        await testingModule.get(RemoveCardFromCourseUseCase).execute({
          cardId: card.id,
          courseId: course.id,
          userId: 'card-removal-owner-id',
        });
        const updatedCard = await testingModule
          .get(FindCardByIdUseCase)
          .execute(card.id);
        expect(updatedCard.courseIds).not.toContain(course.id);
      });
      it('Should throw an error if trying to remove a Card from a non-existing Course', async () => {
        const invalidCourseId = 'invalid-course-id';
        const card = await createSimpleCard({
          title: 'Card for Non-existing Course Removal',
          content: 'This card should not be removed',
          createdBy: 'test-user-id',
        });
        await expect(
          testingModule.get(RemoveCardFromCourseUseCase).execute({
            cardId: card.id,
            courseId: invalidCourseId,
            userId: 'test-user-id',
          }),
        ).rejects.toThrow('Course not found');
      });
      it('Should throw an error if trying to remove a non-existing Card from a Course', async () => {
        const course = await createSimpleCourse({
          title: 'Course for Non-existing Card Removal',
          description: 'This course will try to remove a non-existing card',
          ownerId: 'non-existing-card-owner-id',
        });
        await expect(
          testingModule.get(RemoveCardFromCourseUseCase).execute({
            cardId: 'invalid-card-id',
            courseId: course.id,
            userId: 'test-user-id',
          }),
        ).rejects.toThrow('Card not found');
      });
    });
  });
});

/**
 *
 * Helper testing functions
 *
 */

function findCourseById(id: Identifiant) {
  return testingModule.get(FindCourseByIdUseCase).execute({ id });
}

function createSimpleCourse(
  command?: CreateCourseCommand,
): Promise<CreateCourseResponse> {
  const cmd: CreateCourseCommand = {
    title: command?.title || 'Default Course Title',
    description: command?.description || 'Default Course Description',
    ownerId: command?.ownerId || 'default-owner-id',
  };
  return testingModule.get(CreateCourseUseCase).execute(cmd);
}

function createSimpleCard(command?: Partial<CreateCardCommand>) {
  const courseIds = command?.courseIds || ['default-course-id'];
  const cmd: CreateCardCommand = {
    title: command?.title || 'Default Card Title',
    content: command?.content || 'Default Card Content',
    courseIds,
    createdBy: command?.createdBy || 'default-user-id', // Ajout du champ createdBy
  };
  return testingModule.get(CreateCardUseCase).execute(cmd);
}
