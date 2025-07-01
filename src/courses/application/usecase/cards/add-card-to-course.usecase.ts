import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card } from '../../../domain/card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';
import CourseRepositoryInterface from '../../../domain/repository/course.repository';

export interface AddCardToCourseCommand {
  cardId: Identifiant;
  courseId: Identifiant;
  userId: Identifiant;
}

@Injectable()
export default class AddCardToCourseUseCase extends BaseUseCase<
  AddCardToCourseCommand,
  Card
> {
  constructor(
    private readonly courseRepository: CourseRepositoryInterface,
    private readonly cardRepository: CardRepositoryInterface,
  ) {
    super();
  }

  async execute(command: AddCardToCourseCommand): Promise<Card> {
    const card = await this.cardRepository.findById(command.cardId);
    const course = await this.courseRepository.findById(command.courseId);

    if (!card) {
      throw new Error('Card not found');
    }

    if (!course) {
      throw new Error('Course not found');
    }

    const updatedCard = new Card(
      card.id,
      card.createdBy,
      card.title,
      card.content,
      [...card.courseIds, command.courseId],
      card.createdAt,
      new Date(),
    );

    return this.cardRepository.update(updatedCard);
  }
}
