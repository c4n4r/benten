import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export default class PasswordHasherService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = 10;
  }

  hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, this.saltRounds);
    return hashedPassword;
  }

  comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
