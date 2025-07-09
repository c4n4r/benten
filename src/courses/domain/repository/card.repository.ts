import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateAudioCardCommand } from '../../application/usecase/cards/create-audio-card.usecase';
import { CreateCardCommand } from '../../application/usecase/cards/create-card.usecase';
import { AudioCard } from '../entity/card/audio-card.entity';
import { Card } from '../entity/card/card.entity';

export default abstract class CardRepositoryInterface {
  abstract create(card: CreateCardCommand): Promise<Card>;
  abstract createAudioCard(
    audioCard: CreateAudioCardCommand,
  ): Promise<AudioCard>;
  abstract findById(id: Identifiant): Promise<Card | null>;
  abstract update(card: Card): Promise<Card>;
  abstract delete(id: Identifiant): Promise<void>;
  abstract findByCourseId(courseId: Identifiant): Promise<Card[]>;
}
