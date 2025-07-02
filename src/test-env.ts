import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function testEnv() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Log all environment variables
  console.log('====== Environment Variables ======');
  console.log(`NODE_ENV: ${configService.get<string>('NODE_ENV')}`);
  console.log(`PORT: ${configService.get<number>('PORT')}`);
  console.log(`MONGODB_URI: ${configService.get<string>('MONGODB_URI')}`);

  // Get all environment variables (useful for debugging)
  console.log('====== All Config Variables ======');
  // Afficher uniquement les variables d'environnement spécifiques que nous connaissons
  const configKeys = ['NODE_ENV', 'PORT', 'MONGODB_URI'];
  const configValues = configKeys.reduce(
    (acc, key) => {
      acc[key] = configService.get(key);
      return acc;
    },
    {} as Record<string, unknown>,
  );
  console.log(JSON.stringify(configValues, null, 2));

  await app.close();
}

void testEnv();
