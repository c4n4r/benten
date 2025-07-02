import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import DateHelperInterface from '../../../shared/application/dates/date.helper';
import { Identifiant } from '../../../shared/domain/identifiant';
import PasswordHasherService from '../../../shared/infrastructure/password/password-hasher.service';
import {
  CreateUserCommand,
  UpdateUserCommand,
} from '../../application/types/user-management.types';
import UserRepositoryInterface from '../../domain/repository/user.repository';
import { User, UserDTO } from '../../domain/user.entity';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export default class UserMongodbRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly dateHelper: DateHelperInterface,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async create(user: CreateUserCommand): Promise<User> {
    const hashedPassword = this.passwordHasher.hashPassword(user.password);
    const createdUser = new this.userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
      nickname: user.nickname,
      createdAt: this.dateHelper.now(),
    });

    const savedUser = await createdUser.save();

    return this.mapToUserEntity(savedUser);
  }

  async findById(id: Identifiant): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }

    return this.mapToUserEntity(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.mapToUserEntity(user));
  }

  async update(id: Identifiant, updateData: UpdateUserCommand): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return this.mapToUserEntity(updatedUser);
  }

  async delete(id: Identifiant): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
  }

  private mapToUserEntity(userDocument: UserDocument): User {
    const userDTO: UserDTO = {
      id: String(userDocument._id),
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      password: userDocument.password,
      nickname: userDocument.nickname,
      createdAt: userDocument.createdAt,
    };

    return User.create(userDTO);
  }

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(7); // Simple ID generation
  }
}
