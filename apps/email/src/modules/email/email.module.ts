import { EmailConfigModule } from '../config/email-config.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { createEmailConfig } from './email.config';
import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EMAIL_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';

@Module({
  imports: [
    EmailConfigModule,
    MailerModule.forRootAsync({
      imports: [EmailConfigModule],
      inject: [EMAIL_CONFIG_DI_TOKENS.EMAIL_CONFIG_SERVICE],
      useFactory: createEmailConfig,
    }),
  ],
  providers: [
    {
      provide: EMAIL_DI_TOKENS.EMAIL_SERVICE,
      useClass: EmailService,
    },
  ],
  controllers: [EmailController],
})
export class EmailModule {}
