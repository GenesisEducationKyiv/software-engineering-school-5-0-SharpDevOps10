import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IGateWayConfigService } from './interfaces/gate-way-config.service.interface';

@Injectable()
export class GateWayConfigService implements IGateWayConfigService {
  constructor (private readonly config: NestConfigService) {}

  getPort (): number {
    return this.config.get<number>('PORT', 3001);
  }

  getWeatherClientHost (): string {
    return this.config.get<string>('WEATHER_CLIENT_HOST');
  }

  getWeatherClientPort (): number {
    return this.config.get<number>('WEATHER_CLIENT_PORT');
  }

  getSubscriptionClientHost (): string {
    return this.config.get<string>('SUBSCRIPTION_CLIENT_HOST');
  }

  getSubscriptionClientPort (): number {
    return this.config.get<number>('SUBSCRIPTION_CLIENT_PORT');
  }

  getEmailClientHost (): string {
    return this.config.get<string>('EMAIL_CLIENT_HOST');
  }

  getEmailClientPort (): number {
    return this.config.get<number>('EMAIL_CLIENT_PORT');
  }

}
