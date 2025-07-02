import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CourseDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);
