import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card } from '../../../domain/card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';

export interface CreateCardCommand {
  title: string;
  content: string;
  courseIds: Identifiant[];
  createdBy: Identifiant; // Ajout du champ createdBy
}

@Injectable()
export class CreateCardUseCase extends BaseUseCase<CreateCardCommand, Card> {
  constructor(private readonly cardRepository: CardRepositoryInterface) {
    super();
  }

  async execute(command: CreateCardCommand): Promise<Card> {
    return await this.cardRepository.create(command);
  }
}
