import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from '../../../shared/infrastructure/database/mongodb/mongodb.module';
import CardRepositoryInterface from '../../domain/repository/card.repository';
import CardMongodbRepository from '../repository/card.mongodb.repository';
import { CardDocument, CardSchema } from '../repository/schemas/card.schema';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: CardDocument.name, schema: CardSchema },
    ]),
  ],
  providers: [
    {
      provide: CardRepositoryInterface,
      useClass: CardMongodbRepository,
    },
  ],
  exports: [CardRepositoryInterface],
})
export class CardMongodbModule {}
