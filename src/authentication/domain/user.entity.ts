import { Identifiant } from '../../shared/domain/identifiant';

export type UserDTO = {
  id: Identifiant;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nickname: string;
  createdAt: Date;
};
export class User {
  constructor(
    public id: Identifiant,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public nickname: string,
    public createdAt: Date,
  ) {}

  static create(dto: UserDTO): User {
    return new User(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
      dto.nickname,
      dto.createdAt,
    );
  }

  toDTO(): UserDTO {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      nickname: this.nickname,
      createdAt: this.createdAt,
    };
  }
}
