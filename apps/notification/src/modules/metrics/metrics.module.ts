import { Module } from '@nestjs/common';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { NotificationMetricsPusherService } from './notification-metrics-pusher.service';
import { NOTIFICATION_METRIC_DI_TOKENS } from './di-tokens';
import { notificationMetrics } from './notification.metrics';
import { NotificationConfigModule } from '../config/notification-config.module';

@Module({
  providers: [
    NotificationMetricsPusherService,
    {
      provide: NOTIFICATION_METRIC_DI_TOKENS.NOTIFICATION_METRICS,
      useValue: notificationMetrics,
    },
  ],
  imports: [NotificationConfigModule, LoggerModule],
  exports: [NOTIFICATION_METRIC_DI_TOKENS.NOTIFICATION_METRICS],
})
export class MetricsModule {}
