import { TransportOptions } from 'nodemailer';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailConfigService } from '../config/email-config.service';
import { MailerOptions } from '@nestjs-modules/mailer';

export const createEmailConfig = (configService: EmailConfigService): MailerOptions => ({
  transport: {
    host: configService.getSmtpHost(),
    port: configService.getSmtpPort(),
    auth: {
      user: configService.getSmtpUser(),
      pass: configService.getSmtpPass(),
    },
  } as TransportOptions,
  defaults: {
    from: configService.getMailFrom(),
  },
  template: {
    dir: join(process.cwd(), 'apps', 'email', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
