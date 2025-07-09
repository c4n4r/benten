import { Identifiant } from '../../../shared/domain/identifiant';

export interface CourseDTO {
  id: Identifiant;
  title: string;
  description: string;
  ownerId: Identifiant;
  createdAt: Date;
}

export class Course {
  constructor(
    public readonly id: Identifiant,
    public readonly title: string,
    public readonly description: string,
    public readonly ownerId: Identifiant,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(dto: CourseDTO): Course {
    return new Course(
      dto.id,
      dto.title,
      dto.description,
      dto.ownerId,
      dto.createdAt,
    );
  }
}
