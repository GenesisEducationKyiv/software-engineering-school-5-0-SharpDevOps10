import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IEmailConfigService } from './interfaces/email-config.service.interface';

@Injectable()
export class EmailConfigService implements IEmailConfigService {
  constructor (private readonly config: NestConfigService) {}

  getPort (): number {
    return this.config.get<number>('PORT', 3001);
  }

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
}
