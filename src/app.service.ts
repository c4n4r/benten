import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const environment =
      this.configService.get<string>('NODE_ENV') || 'development';
    const dbName = this.configService.get<string>('DATABASE_NAME') || 'unknown';

    return `Hello World! Running in ${environment} environment with database: ${dbName}`;
  }
}
