import { Identifiant } from '../../../shared/domain/identifiant';

export interface CreateCourseCommand {
  ownerId: Identifiant;
  title: string;
  description: string;
}

export interface CreateCourseResponse extends CreateCourseCommand {
  id: Identifiant;
  createdAt: Date;
}

export interface UpdateCourseCommand {
  title?: string;
  description?: string;
}

export interface CreateCardForCourseCommand {
  title: string;
  content: string;
  courseId: Identifiant;
}
