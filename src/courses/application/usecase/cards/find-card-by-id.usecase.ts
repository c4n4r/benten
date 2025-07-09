import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card } from '../../../domain/entity/card/card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';

@Injectable()
export default class FindCardByIdUseCase extends BaseUseCase<
  Identifiant,
  Card
> {
  constructor(private readonly repository: CardRepositoryInterface) {
    super();
  }

  async execute(id: Identifiant): Promise<Card> {
    const card = await this.repository.findById(id);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }
}
