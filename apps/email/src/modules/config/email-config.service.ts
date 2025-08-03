import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EmailConfigServiceInterface } from './interfaces/email-config.service.interface';

@Injectable()
export class EmailConfigService implements EmailConfigServiceInterface {
  constructor (private readonly config: NestConfigService) {}

  getSmtpHost (): string {
    return this.config.get<string>('SMTP_HOST');
  }

  getSmtpPort (): number {
    return this.config.get<number>('SMTP_PORT', 587);
  }

  getSmtpUser (): string {
    return this.config.get<string>('SMTP_USER');
  }

  getSmtpPass (): string {
    return this.config.get<string>('SMTP_PASS');
  }

  getMailFrom (): string {
    return this.config.get<string>('MAIL_FROM');
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

  getPort (): number {
    return this.config.get<number>('PORT');
  }
}
