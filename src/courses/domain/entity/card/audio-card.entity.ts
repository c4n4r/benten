import { Identifiant } from '../../../../shared/domain/identifiant';
import { Card, CardDTO } from './card.entity';

export interface AudioCardDTO extends CardDTO {
  audioUrl: string;
}

export class AudioCard extends Card {
  constructor(
    public id: Identifiant,
    public createdBy: Identifiant,
    public title: string,
    public content: string,
    public courseIds: Identifiant[] = [],
    public audioUrl: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    super(id, createdBy, title, content, courseIds, createdAt, updatedAt);
    this.audioUrl = audioUrl;
  }
  static create(dto: AudioCardDTO): AudioCard {
    return new AudioCard(
      dto.id,
      dto.createdBy,
      dto.title,
      dto.content,
      dto.courseIds ?? [],
      dto.audioUrl,
      dto.createdAt,
      dto.updatedAt,
    );
  }

  toDTO(): AudioCardDTO {
    const cardDto = super.toDTO();
    return { ...cardDto, audioUrl: this.audioUrl };
  }
}
