import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { emailValidationSchema } from './email-validation.schema';
import { EmailConfigService } from './email-config.service';
import { EMAIL_CONFIG_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['apps/email/.env'],
      validationSchema: emailValidationSchema,
    }),
  ],
  providers: [
    EmailConfigService,
    {
      provide: EMAIL_CONFIG_DI_TOKENS.EMAIL_CONFIG_SERVICE,
      useExisting: EmailConfigService,
    },
  ],
  exports: [EMAIL_CONFIG_DI_TOKENS.EMAIL_CONFIG_SERVICE],
})
export class EmailConfigModule {}
