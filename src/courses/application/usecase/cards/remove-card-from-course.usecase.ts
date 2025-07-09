import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card } from '../../../domain/entity/card/card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';
import CourseRepositoryInterface from '../../../domain/repository/course.repository';

export interface RemoveCardFromCourseCommand {
  cardId: Identifiant;
  courseId: Identifiant;
  userId: Identifiant;
}

@Injectable()
export default class RemoveCardFromCourseUseCase extends BaseUseCase<
  RemoveCardFromCourseCommand,
  void
> {
  constructor(
    private readonly courseRepository: CourseRepositoryInterface,
    private readonly cardRepository: CardRepositoryInterface,
  ) {
    super();
  }

  async execute(command: RemoveCardFromCourseCommand): Promise<void> {
    const { cardId, courseId } = command;
    const card = await this.cardRepository.findById(cardId);
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (!card) {
      throw new Error('Card not found');
    }

    const updatedCourseIds = card.courseIds.filter((id) => id !== courseId);

    const updatedCard = new Card(
      card.id,
      card.createdBy,
      card.title,
      card.content,
      updatedCourseIds,
      card.createdAt,
      new Date(),
    );

    await this.cardRepository.update(updatedCard);
  }
}
