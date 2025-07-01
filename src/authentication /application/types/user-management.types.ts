import { Identifiant } from '../../../shared/domain/identifiant';

export type CreateUserResponse = Omit<
  CreateUserCommand,
  'password' | 'confirmPassword'
> & {
  createdAt: Date;
  id: Identifiant;
};

export type UpdateUserCommand = Partial<
  Omit<CreateUserCommand, 'confirmPassword' | 'password' | 'id'>
>;

export type CreateUserCommand = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};
