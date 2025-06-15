import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { emailConfig } from './email.config';
import { EmailService } from './email.service';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';

@Module({
  imports: [
    MailerModule.forRoot(emailConfig),
  ],
  providers: [
    EmailService,
    {
      provide: DI_TOKENS.EMAIL_SERVICE,
      useClass: EmailService,
    },
  ],
  exports: [DI_TOKENS.EMAIL_SERVICE],
})
export class EmailModule {}
