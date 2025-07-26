import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { notificationValidationSchema } from './notification-validation.schema';
import { NotificationConfigService } from './notification-config.service';
import { NOTIFICATION_CONFIG_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['apps/notification/.env'],
      validationSchema: notificationValidationSchema,
    }),
  ],
  providers: [
    NotificationConfigService,
    {
      provide: NOTIFICATION_CONFIG_DI_TOKENS.NOTIFICATION_CONFIG_SERVICE,
      useExisting: NotificationConfigService,
    },
  ],
  exports: [NotificationConfigService, NOTIFICATION_CONFIG_DI_TOKENS.NOTIFICATION_CONFIG_SERVICE],
})
export class NotificationConfigModule {}
