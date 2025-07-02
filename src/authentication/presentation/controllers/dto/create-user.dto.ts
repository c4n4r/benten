import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}
