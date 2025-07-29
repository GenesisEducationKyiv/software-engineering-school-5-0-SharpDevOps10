import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ISubscriptionConfigService } from './interfaces/subscription-config.service.interface';

@Injectable()
export class SubscriptionConfigService implements ISubscriptionConfigService {
  constructor (private readonly config: NestConfigService) {}

  getPort (): number {
    return this.config.get<number>('PORT', 3002);
  }

  getTokenTtlHours (): number {
    return this.config.get<number>('TOKEN_TTL_HOURS', 24);
  }

  getFrontendUrl (): string {
    return this.config.get<string>('FRONTEND_URL');
  }

  getWeatherClientHost (): string {
    return this.config.get<string>('WEATHER_CLIENT_HOST');
  }

  getWeatherClientPort (): number {
    return this.config.get<number>('WEATHER_CLIENT_PORT');
  }

  getRabbitMqHost (): string {
    return this.config.get<string>('RABBITMQ_HOST');
  }

  getRabbitMqPort (): number {
    return this.config.get<number>('RABBITMQ_PORT');
  }
}
