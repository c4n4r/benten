import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get<number>('PORT') || 3000;
  const mongoUri = configService.get<string>('MONGODB_URI');
  if (!mongoUri) {
    console.error('MONGODB_URI is not set in the environment variables.');
    process.exit(1);
  }

  await app.listen(port);
  console.log(
    `Application running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`,
  );
}
void bootstrap();
