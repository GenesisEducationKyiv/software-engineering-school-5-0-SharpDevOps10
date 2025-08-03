import { Module } from '@nestjs/common';
import { SUBSCRIPTION_METRIC_DI_TOKENS } from './di-tokens';
import { subscriptionMetrics } from './subscription.metrics';
import { SubscriptionMetricsPusherService } from './subscription-metrics-pusher.service';
import { SubscriptionConfigModule } from '../config/subscription-config.module';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  providers: [
    SubscriptionMetricsPusherService,
    {
      provide: SUBSCRIPTION_METRIC_DI_TOKENS.SUBSCRIPTION_METRICS,
      useValue: subscriptionMetrics,
    },
  ],
  imports: [SubscriptionConfigModule, LoggerModule],
  exports: [SUBSCRIPTION_METRIC_DI_TOKENS.SUBSCRIPTION_METRICS],
})
export class MetricsModule {}
