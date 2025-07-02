import { Injectable, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  getConnectionToken,
  InjectModel,
  MongooseModule,
} from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types } from 'mongoose';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import { Identifiant } from '../../../shared/domain/identifiant';
import DateHelper from '../../../shared/infrastructure/dates/date.helper';
import {
  CreateUserCommand,
  CreateUserResponse,
  UpdateUserCommand,
} from '../../application/types/user-management.types';
import CreateUserUseCase from '../../application/usecase/create-user.usecase';
import FindUserUseCase from '../../application/usecase/find-user.usecase';
import UpdateUserUseCase from '../../application/usecase/update-user.usecase';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { User } from '../../domain/user.entity';
import {
  UserDocument,
  UserSchema,
} from '../../infrastructure/repository/schemas/user.schema';

describe('User Management MongoDB (Feature Tests)', () => {
  // Increase timeout for all tests in this suite
  jest.setTimeout(30000);
  let moduleRef: TestingModule;
  let createUserUseCase: CreateUserUseCase;
  let findUserUseCase: FindUserUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;
  let _now: Date;

  beforeAll(async () => {
    // Create in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: UserDocument.name, schema: UserSchema },
        ]),
      ],
      providers: [
        {
          provide: DateHelperInterface,
          useClass: class extends DateHelper {
            now(): Date {
              return _now;
            }
          },
        },
        {
          provide: UserRepositoryInterface,
          useClass: TestUserMongodbRepository,
        },
        CreateUserUseCase,
        FindUserUseCase,
        UpdateUserUseCase,
      ],
    }).compile();

    createUserUseCase = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
    findUserUseCase = moduleRef.get<FindUserUseCase>(FindUserUseCase);
    updateUserUseCase = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCase);
    connection = moduleRef.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    // Clean up
    if (connection) {
      await connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    await moduleRef.close();
  });

  beforeEach(async () => {
    // Clear database between tests
    if (connection) {
      const collections = connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  });

  // Test data
  const johnDoe: CreateUserCommand = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123',
    nickname: 'johndoe',
  };

  // Test helpers
  const givenNowIs = (date: Date) => {
    _now = date;
  };

  const whenUserWantToSubscribeToTheService = (
    userDetails: CreateUserCommand,
  ): Promise<CreateUserResponse> => {
    return createUserUseCase.execute(userDetails);
  };

  const whenExistingUserWantsToUpdateHisInfos = async (
    userId: Identifiant,
    updateDetails: UpdateUserCommand,
  ) => {
    return updateUserUseCase.execute({
      id: userId,
      updateUserCommand: updateDetails,
    });
  };

  const whenTheUserWantToRetrieveHisInfos = async (userId: Identifiant) => {
    return findUserUseCase.execute(userId);
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

  // Tests
  describe('User creation', () => {
    it('Should create a new user in MongoDB', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const user = await whenUserWantToSubscribeToTheService(johnDoe);
      thenTheUserShouldBeCreated(user);
    });
  });

  describe('User retrieval', () => {
    it('Should retrieve a user by ID from MongoDB', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      const user = await whenUserWantToSubscribeToTheService(johnDoe);
      const found = await whenTheUserWantToRetrieveHisInfos(user.id);
      thenTheUserShouldBeRetrieved(found, user);
    });

    it('Should throw an error if user not found in MongoDB', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      // Create a valid MongoDB ObjectId that doesn't exist in the database
      const nonExistingId = new Types.ObjectId().toString();
      await expect(
        whenTheUserWantToRetrieveHisInfos(nonExistingId),
      ).rejects.toThrow(`User with ID ${nonExistingId} not found`);
    });
  });

  describe('User update', () => {
    it('Should be able to update a user in MongoDB', async () => {
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

      // Verify persistence by retrieving the user again
      const retrievedUser = await whenTheUserWantToRetrieveHisInfos(user.id);
      expect(retrievedUser.firstName).toEqual('Jane');
      expect(retrievedUser.lastName).toEqual('Doe');
    });
  });

  // Additional MongoDB-specific tests
  describe('MongoDB specific features', () => {
    it('Should enforce email uniqueness', async () => {
      givenNowIs(new Date('2023-10-01T12:00:00Z'));
      await whenUserWantToSubscribeToTheService(johnDoe);

      // Try to create another user with the same email
      const duplicateUser = {
        ...johnDoe,
        firstName: 'Jane',
        lastName: 'Smith',
        nickname: 'janesmith',
      };

      await expect(
        whenUserWantToSubscribeToTheService(duplicateUser),
      ).rejects.toThrow();
    });
  });
});

// Custom repository for testing with MongoDB ObjectIds
@Injectable()
class TestUserMongodbRepository extends UserRepositoryInterface {
  private readonly logger = new Logger(TestUserMongodbRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly dateHelper: DateHelperInterface,
  ) {
    super();
  }

  async create(user: CreateUserCommand): Promise<User> {
    const createdUser = new this.userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      nickname: user.nickname,
      createdAt: this.dateHelper.now(),
    });

    const savedUser = await createdUser.save();
    return this.mapToUserEntity(savedUser);
  }

  async findById(id: Identifiant): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        return null;
      }
      return this.mapToUserEntity(user);
    } catch (error) {
      this.logger.error(
        `Error finding user with ID ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.mapToUserEntity(user));
  }

  async update(id: Identifiant, updateData: UpdateUserCommand): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return this.mapToUserEntity(updatedUser);
    } catch (error) {
      this.logger.error(
        `Error updating user with ID ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async delete(id: Identifiant): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
  }

  private mapToUserEntity(userDocument: UserDocument): User {
    return User.create({
      id: userDocument._id?.toString() || '',
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      password: userDocument.password,
      nickname: userDocument.nickname,
      createdAt: userDocument.createdAt,
    });
  }
}
