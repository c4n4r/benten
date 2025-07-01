import { Identifiant } from '../../shared/domain/identifiant';

export interface CardDTO {
  id: Identifiant;
  createdBy: Identifiant; // Renommé ownerId en createdBy
  title: string;
  content: string;
  courseIds?: Identifiant[]; // Une Card peut être dans X courses ou aucune
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card {
  constructor(
    public readonly id: Identifiant,
    public readonly createdBy: Identifiant, // Renommé ownerId en createdBy
    public readonly title: string,
    public readonly content: string,
    public readonly courseIds: Identifiant[] = [], // Par défaut aucune affiliation
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(dto: CardDTO): Card {
    return new Card(
      dto.id,
      dto.createdBy,
      dto.title,
      dto.content,
      dto.courseIds ?? [], // Par défaut aucune affiliation
      dto.createdAt,
      dto.updatedAt,
    );
  }
}
