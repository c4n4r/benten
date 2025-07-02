import { Test, TestingModule } from '@nestjs/testing';
import { Identifiant } from '../../../shared/domain/identifiant';
import PasswordHasherService from '../../../shared/infrastructure/password/password-hasher.service';
import {
  CreateUserCommand,
  CreateUserResponse,
  UpdateUserCommand,
} from '../../application/types/user-management.types';
import CreateUserUseCase from '../../application/usecase/create-user.usecase';
import FindUserUseCase from '../../application/usecase/find-user.usecase';
import UpdateUserUseCase from '../../application/usecase/update-user.usecase';
import { User } from '../../domain/user.entity';
import AuthenticationTestingModule from '../module/authentication.tesing.module';

export let _now: Date;
let testingModule: TestingModule;
describe('User management', () => {
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AuthenticationTestingModule],
    }).compile();
  });
  describe('User creation', () => {
    it('Should create a new user', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const user = await whenUserWantToSubscribeToTheService(johnDoe);
      thenTheUserShouldBeCreated(user);
    });
    it("Should hash the user's password", async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const spy = jest.spyOn(
        testingModule.get(PasswordHasherService),
        'hashPassword',
      );
      await whenUserWantToSubscribeToTheService(johnDoe);
      expect(spy).toHaveBeenCalledWith(johnDoe.password);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('User retrieval', () => {
    it('Should retrieve a user by ID', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const user = await whenUserWantToSubscribeToTheService(johnDoe);
      const found = await whenTheUserWantToRetrieveHisInfos(user.id);
      thenTheUserShouldBeRetrieved(found, user);
    });
    it('Should throw an error if user not found', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const found = whenTheUserWantToRetrieveHisInfos('non-existing-id');
      await expect(found).rejects.toThrow(
        'User with ID non-existing-id not found',
      );
    });
  });
  describe('User update', () => {
    it('Should be able to update a user', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const user = await whenUserWantToSubscribeToTheService(johnDoe);
      const updatedUser = await whenExistingUserWantsToUpdateHisInfos(user.id, {
        firstName: 'Jane',
        lastName: 'Doe',
      });
      thenTheUserShouldBeUpdated(updatedUser, {
        ...johnDoe,
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });
  });

  // methods for the test
  const johnDoe: CreateUserCommand = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123',
    nickname: 'johndoe',
  };

  const givenNowIs = (date: Date) => {
    _now = date;
  };

  const whenUserWantToSubscribeToTheService = (
    userDetails: CreateUserCommand,
  ): Promise<CreateUserResponse> => {
    const useCase = testingModule.get<CreateUserUseCase>(CreateUserUseCase);
    return useCase.execute(userDetails);
  };

  const whenExistingUserWantsToUpdateHisInfos = async (
    userId: Identifiant,
    updateDetails: UpdateUserCommand,
  ) => {
    const useCase = testingModule.get<UpdateUserUseCase>(UpdateUserUseCase);
    return useCase.execute({ id: userId, updateUserCommand: updateDetails });
  };

  const whenTheUserWantToRetrieveHisInfos = async (userId: Identifiant) => {
    const useCase = testingModule.get<FindUserUseCase>(FindUserUseCase);
    return useCase.execute(userId);
  };

  const thenTheUserShouldBeUpdated = (
    updatedUser: User,
    expectedUser: CreateUserCommand,
  ) => {
    const userDTO = updatedUser.toDTO();
    expect(userDTO.createdAt).toEqual(_now);
    expect(userDTO.email).toEqual(expectedUser.email);
    expect(userDTO.firstName).toEqual(expectedUser.firstName);
    expect(userDTO.lastName).toEqual(expectedUser.lastName);
    expect(userDTO.nickname).toEqual(expectedUser.nickname);
  };

  const thenTheUserShouldBeRetrieved = (
    foundUser: User,
    expectedUser: CreateUserResponse,
  ) => {
    const userDTO = foundUser.toDTO();
    expect(userDTO.createdAt).toEqual(expectedUser.createdAt);
    expect(userDTO.email).toEqual(expectedUser.email);
    expect(userDTO.firstName).toEqual(expectedUser.firstName);
    expect(userDTO.lastName).toEqual(expectedUser.lastName);
    expect(userDTO.nickname).toEqual(expectedUser.nickname);
    expect(userDTO.id).toEqual(expectedUser.id);
  };
  const thenTheUserShouldBeCreated = (expectedUser: CreateUserResponse) => {
    expect(expectedUser).toEqual({
      createdAt: _now,
      id: expectedUser.id, // Assuming the ID is generated and returned
      email: johnDoe.email,
      firstName: johnDoe.firstName,
      lastName: johnDoe.lastName,
      nickname: johnDoe.nickname,
    });
  };
});
