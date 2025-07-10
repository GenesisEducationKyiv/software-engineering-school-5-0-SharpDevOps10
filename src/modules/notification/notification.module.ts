import { Module } from '@nestjs/common';
import { NotificationController } from '@notification/presentation/notification.controller';
import { EmailModule } from '@email/email.module';
import { SubscriptionModule } from '@subscription/subscription.module';
import { WeatherModule } from '@weather/weather.module';
import { LoggerModule } from '@modules/logger/logger.module';
import { EmailJobService } from '@notification/application/jobs/email-job.service';
import { NOTIFICATION_DI_TOKENS } from '@notification/di-tokens';

@Module({
  providers: [
    NotificationController,
    {
      provide: NOTIFICATION_DI_TOKENS.EMAIL_JOB_SERVICE,
      useClass: EmailJobService,
    },
  ],
  imports: [EmailModule, SubscriptionModule, WeatherModule, LoggerModule],
})
export class NotificationModule {}
