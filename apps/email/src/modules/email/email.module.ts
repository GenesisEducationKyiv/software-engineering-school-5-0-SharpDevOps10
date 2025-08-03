import { EmailConfigModule } from '../config/email-config.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { createEmailConfig } from './email.config';
import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { EMAIL_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { EmailTemplateValidator } from './validators/email-template.validator';
import { EmailConsumer } from './email.consumer';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    EmailConfigModule,
    LoggerModule,
    MetricsModule,
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
    {
      provide: EMAIL_DI_TOKENS.EMAIL_TEMPLATE_VALIDATOR,
      useClass: EmailTemplateValidator,
    },
  ],
  controllers: [EmailConsumer],
})
export class EmailModule {}
