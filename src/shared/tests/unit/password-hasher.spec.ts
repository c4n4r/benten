import { Test, TestingModule } from '@nestjs/testing';
import PasswordHasherService from '../../infrastructure/password/password-hasher.service';

let testingModule: TestingModule;

describe('password hashing management', () => {
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PasswordHasherService],
    }).compile();
  });
  afterEach(async () => {
    await testingModule.close();
  });
  it('should hash a password', () => {
    const passwordHasher = testingModule.get<PasswordHasherService>(
      PasswordHasherService,
    );
    const password = 'securePassword123';
    const hashedPassword = passwordHasher.hashPassword(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(password);
  });
  it('should compare passwords correctly', () => {
    const passwordHasher = testingModule.get<PasswordHasherService>(
      PasswordHasherService,
    );
    const password = 'securePassword123';
    const hashedPassword = passwordHasher.hashPassword(password);
    const isMatch = passwordHasher.comparePasswords(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
  it('should return false for incorrect password comparison', () => {
    const passwordHasher = testingModule.get<PasswordHasherService>(
      PasswordHasherService,
    );
    const password = 'securePassword123';
    const hashedPassword = passwordHasher.hashPassword(password);
    const isMatch = passwordHasher.comparePasswords(
      'wrongPassword',
      hashedPassword,
    );
    expect(isMatch).toBe(false);
  });
});
