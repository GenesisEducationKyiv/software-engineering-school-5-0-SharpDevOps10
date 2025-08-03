import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { NOTIFICATION_DI_TOKENS } from './di-tokens';
import { EmailJobService } from './application/jobs/email-job.service';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { WeatherClientModule } from '../clients/weather-client/weather-client.module';
import { NotificationEmailSenderService } from './infrastructure/email-sender/notification.email-sender.service';
import { EmailProducerModule } from '@utils/modules/producers/email-producer/email-producer.module';
import { SubscriptionProducerModule } from './producers/subscription-producer.module';
import { MetricsModule } from '../metrics/metrics.module';

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
  imports: [
    WeatherClientModule,
    EmailProducerModule,
    LoggerModule,
    SubscriptionProducerModule,
    MetricsModule,
  ],
})
export class NotificationModule {}
