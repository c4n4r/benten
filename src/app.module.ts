import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthenticationModule from './authentication/authentication.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongodbModule } from './shared/infrastructure/database/mongodb/mongodb.module';

@Module({
  imports: [ConfigurationModule, MongodbModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
