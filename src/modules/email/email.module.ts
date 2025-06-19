import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { emailConfig } from './email.config';
import { EmailService } from './email.service';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';

@Module({
  imports: [
    MailerModule.forRoot(emailConfig),
  ],
  providers: [
    EmailService,
    {
      provide: EMAIL_DI_TOKENS.EMAIL_SERVICE,
      useClass: EmailService,
    },
  ],
  exports: [EMAIL_DI_TOKENS.EMAIL_SERVICE],
})
export class EmailModule {}
