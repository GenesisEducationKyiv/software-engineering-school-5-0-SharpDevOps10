import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { NotificationConfigServiceInterface } from './interfaces/notification-config.service.interface';

@Injectable()
export class NotificationConfigService implements NotificationConfigServiceInterface {
  constructor (private readonly config: NestConfigService) {}

  getPort (): number {
    return this.config.get<number>('PORT', 3004);
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

  getRabbitMqHost (): string {
    return this.config.get<string>('RABBITMQ_HOST');
  }

  getRabbitMqPort (): number {
    return this.config.get<number>('RABBITMQ_PORT');
  }

  getSubscriptionProducerTimeout (): number {
    return this.config.get<number>('SUBSCRIPTION_PRODUCER_TIMEOUT');
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
