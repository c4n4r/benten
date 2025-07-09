import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Identifiant } from '../../../shared/domain/identifiant';
import { CreateCardCommand } from '../../application/usecase/cards/create-card.usecase';
import { Card } from '../../domain/entity/card/card.entity';
import CardRepositoryInterface from '../../domain/repository/card.repository';
import { CardDocument } from './schemas/card.schema';

@Injectable()
export default class CardMongodbRepository implements CardRepositoryInterface {
  constructor(
    @InjectModel(CardDocument.name) private cardModel: Model<CardDocument>,
  ) {}

  async create(card: CreateCardCommand): Promise<Card> {
    const id = this.generateId();
    const createdCard = new this.cardModel({
      _id: id,
      createdBy: card.createdBy,
      title: card.title,
      content: card.content,
      courseIds: card.courseIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedCard = await createdCard.save();

    return new Card(
      savedCard._id as Identifiant,
      savedCard.createdBy as Identifiant,
      savedCard.title,
      savedCard.content,
      savedCard.courseIds as Identifiant[],
      savedCard.createdAt,
      savedCard.updatedAt,
    );
  }

  async findById(id: Identifiant): Promise<Card | null> {
    const card = await this.cardModel.findById(id).exec();

    if (!card) {
      return null;
    }

    return new Card(
      card._id as Identifiant,
      card.createdBy as Identifiant,
      card.title,
      card.content,
      card.courseIds as Identifiant[],
      card.createdAt,
      card.updatedAt,
    );
  }

  async update(card: Card): Promise<Card> {
    const updatedCard = await this.cardModel
      .findByIdAndUpdate(
        card.id,
        {
          title: card.title,
          content: card.content,
          courseIds: card.courseIds,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedCard) {
      throw new Error('Card not found');
    }

    return new Card(
      updatedCard._id as Identifiant,
      updatedCard.createdBy as Identifiant,
      updatedCard.title,
      updatedCard.content,
      updatedCard.courseIds as Identifiant[],
      updatedCard.createdAt,
      updatedCard.updatedAt,
    );
  }

  async delete(id: Identifiant): Promise<void> {
    const result = await this.cardModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new Error('Card not found');
    }
  }

  async findByCourseId(courseId: Identifiant): Promise<Card[]> {
    const cards = await this.cardModel.find({ courseIds: courseId }).exec();

    return cards.map(
      (card) =>
        new Card(
          card._id as Identifiant,
          card.createdBy as Identifiant,
          card.title,
          card.content,
          card.courseIds as Identifiant[],
          card.createdAt,
          card.updatedAt,
        ),
    );
  }

  private generateId(): Identifiant {
    return (Math.random() + 1).toString(36).substring(2);
  }
}
