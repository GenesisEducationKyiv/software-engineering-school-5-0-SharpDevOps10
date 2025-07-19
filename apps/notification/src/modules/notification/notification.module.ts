import { Module } from '@nestjs/common';
import { EmailClientModule } from '../clients/email-client/email-client.module';
import { SubscriptionClientModule } from '../clients/subscription-client/subscription-client.module';
import { NotificationController } from './presentation/notification.controller';
import { NOTIFICATION_DI_TOKENS } from './di-tokens';
import { EmailJobService } from './application/jobs/email-job.service';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { WeatherClientModule } from '../clients/weather-client/weather-client.module';
import { NotificationEmailSenderService } from './infrastructure/email-sender/notification.email-sender.service';

@Module({
  providers: [
    NotificationController,
    {
      provide: NOTIFICATION_DI_TOKENS.EMAIL_JOB_SERVICE,
      useClass: EmailJobService,
    },
    {
      provide: NOTIFICATION_DI_TOKENS.NOTIFICATION_EMAIL_SENDER,
      useClass: NotificationEmailSenderService,
    },
  ],
  imports: [WeatherClientModule, SubscriptionClientModule, EmailClientModule, LoggerModule],
})
export class NotificationModule {}
