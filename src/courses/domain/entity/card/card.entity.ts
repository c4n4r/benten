import { Identifiant } from '../../../../shared/domain/identifiant';

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
    public id: Identifiant,
    public createdBy: Identifiant, // Renommé ownerId en createdBy
    public title: string,
    public content: string,
    public courseIds: Identifiant[] = [], // Par défaut aucune affiliation
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
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
  toDTO(): CardDTO {
    return {
      id: this.id,
      createdBy: this.createdBy,
      title: this.title,
      content: this.content,
      courseIds: this.courseIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(dto: CardDTO): void {
    this.title = dto.title;
    this.content = dto.content;
    this.courseIds = dto.courseIds ?? [];
    this.updatedAt = new Date();
  }
}
