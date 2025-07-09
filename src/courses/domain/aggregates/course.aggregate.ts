import { Identifiant } from '../../../shared/domain/identifiant';
import { Card } from '../entity/card/card.entity';
import { Course } from '../entity/course.entity';

export default class CourseAggregate {
  constructor(
    public id: Identifiant,
    public title: string,
    public description: string,
    public ownerId: Identifiant,
    public cards: Card[],
    public createdAt: Date = new Date(),
  ) {}

  static create(course: Course, cards: Card[] = []): CourseAggregate {
    return new CourseAggregate(
      course.id,
      course.title,
      course.description,
      course.ownerId,
      cards,
      course.createdAt,
    );
  }
  addCard(card: Card): void {
    this.cards.push(card);
  }
  removeCard(cardId: string): void {
    this.cards = this.cards.filter((card) => card.id !== cardId);
  }
  cardsCount(): number {
    return this.cards.length;
  }
}
