import { Module } from '@nestjs/common';
import { NotificationService } from '@modules/notification/notification.service';
import { EmailModule } from '@email/email.module';
import { SubscriptionModule } from '@subscription/subscription.module';
import { WeatherModule } from '@weather/weather.module';
import { LoggerModule } from '@modules/logger/logger.module';
import { EmailJobService } from '@notification/jobs/email-job.service';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';

@Module({
  providers: [
    NotificationService,
    {
      provide: DI_TOKENS.EMAIL_JOB_SERVICE,
      useClass: EmailJobService,
    },
  ],
  imports: [EmailModule, SubscriptionModule, WeatherModule, LoggerModule],
})
export class NotificationModule {}
