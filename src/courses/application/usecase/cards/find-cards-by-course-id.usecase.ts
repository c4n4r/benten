import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card } from '../../../domain/card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';

@Injectable()
export default class FindCardsByCourseIdUseCase extends BaseUseCase<
  Identifiant,
  Card[]
> {
  constructor(private readonly cardRepository: CardRepositoryInterface) {
    super();
  }

  async execute(id: Identifiant): Promise<Card[]> {
    return this.cardRepository.findByCourseId(id);
  }
}
