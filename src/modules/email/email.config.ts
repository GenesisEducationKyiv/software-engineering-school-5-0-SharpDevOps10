import { TransportOptions } from 'nodemailer';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const emailConfig = {
  transport: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as TransportOptions,
  defaults: {
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
  },
  template: {
    dir: join(process.cwd(), 'email', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
