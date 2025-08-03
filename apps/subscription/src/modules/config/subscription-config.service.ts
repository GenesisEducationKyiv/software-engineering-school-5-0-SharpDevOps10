import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { SubscriptionConfigServiceInterface } from './interfaces/subscription-config.service.interface';

@Injectable()
export class SubscriptionConfigService implements SubscriptionConfigServiceInterface {
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

  getPushGatewayUrl (): string {
    return this.config.get<string>('PROMETHEUS_PUSH_GATEWAY_URL');
  }

  getMetricsJobName (): string {
    return this.config.get<string>('PROMETHEUS_METRICS_JOB_NAME');
  }

  getMetricsPushInterval (): number {
    return this.config.get<number>('PROMETHEUS_METRICS_PUSH_INTERVAL');
  }
}
