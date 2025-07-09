import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateAudioCardCommand } from '../../application/usecase/cards/create-audio-card.usecase';
import { CreateCardCommand } from '../../application/usecase/cards/create-card.usecase';
import { AudioCard } from '../../domain/entity/card/audio-card.entity';
import { Card } from '../../domain/entity/card/card.entity';
import CardRepositoryInterface from '../../domain/repository/card.repository';

export default class CardInMemoryRepository implements CardRepositoryInterface {
  createAudioCard(audioCard: CreateAudioCardCommand): Promise<AudioCard> {
    const id = this.generateId();
    const newAudioCard: AudioCard = new AudioCard(
      id,
      audioCard.createdBy,
      audioCard.title,
      audioCard.content,
      audioCard.courseIds,
      audioCard.audioUrl,
      new Date(),
      new Date(),
    );
    this.cards.set(id.toString(), newAudioCard);
    return Promise.resolve(newAudioCard);
  }
  create(card: CreateCardCommand): Promise<Card> {
    const id = this.generateId();
    const newCard: Card = new Card(
      id,
      card.createdBy, // Ajout du champ createdBy
      card.title,
      card.content,
      card.courseIds,
      new Date(),
      new Date(),
    );
    this.cards.set(id.toString(), newCard);
    return Promise.resolve(newCard);
  }
  findById(id: Identifiant): Promise<Card | null> {
    const card = this.cards.get(id.toString()) || null;
    return Promise.resolve(card);
  }
  update(card: Card): Promise<Card> {
    const existingCard: Card | undefined = this.cards.get(card.id.toString());
    if (!existingCard) {
      throw new Error('Card not found');
    }

    existingCard.update(card.toDTO());
    this.cards.set(card.id.toString(), existingCard);
    return Promise.resolve(this.cards.get(card.id.toString())!);
  }
  delete(id: Identifiant): Promise<void> {
    this.cards.delete(id.toString());
    return Promise.resolve();
  }
  findByCourseId(courseId: Identifiant): Promise<Card[]> {
    return Promise.resolve(
      Array.from(this.cards.values()).filter((card) =>
        card.courseIds.includes(courseId),
      ),
    );
  }
  private cards: Map<string, Card> = new Map();

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(2);
  }
}
