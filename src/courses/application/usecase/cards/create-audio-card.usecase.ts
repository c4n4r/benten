import { Injectable } from '@nestjs/common';
import BaseUseCase from '../../../../shared/application/usecase/base.usecase';
import { AudioCard } from '../../../domain/entity/card/audio-card.entity';
import CardRepositoryInterface from '../../../domain/repository/card.repository';
import { CreateCardCommand } from './create-card.usecase';

export interface CreateAudioCardCommand extends CreateCardCommand {
  audioUrl: string;
}
@Injectable()
export default class CreateAudioCardUseCase extends BaseUseCase<
  CreateAudioCardCommand,
  AudioCard
> {
  constructor(private readonly audioCardRepository: CardRepositoryInterface) {
    super();
  }
  async execute(input: CreateAudioCardCommand): Promise<AudioCard> {
    if (!input.title || !input.content) {
      throw new Error('Title and content are required');
    }
    return this.audioCardRepository.createAudioCard(input);
  }
}
