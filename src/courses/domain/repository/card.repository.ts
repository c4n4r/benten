import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateCardCommand } from '../../application/usecase/cards/create-card.usecase';
import { Card } from '../card.entity';

export default abstract class CardRepositoryInterface {
  abstract create(card: CreateCardCommand): Promise<Card>;
  abstract findById(id: Identifiant): Promise<Card | null>;
  abstract update(card: Card): Promise<Card>;
  abstract delete(id: Identifiant): Promise<void>;
  abstract findByCourseId(courseId: Identifiant): Promise<Card[]>;
}
