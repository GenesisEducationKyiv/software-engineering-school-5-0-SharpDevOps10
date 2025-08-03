import { Module } from '@nestjs/common';
import { EMAIL_METRIC_DI_TOKENS } from './di-tokens';
import { EmailMetricsPusherService } from './email-metrics-pusher.service';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { emailMetrics } from './email.metrics';
import { EmailConfigModule } from '../config/email-config.module';

@Module({
  providers: [
    EmailMetricsPusherService,
    {
      provide: EMAIL_METRIC_DI_TOKENS.EMAIL_METRICS,
      useValue: emailMetrics,
    },
  ],
  imports: [EmailConfigModule, LoggerModule],
  exports: [EMAIL_METRIC_DI_TOKENS.EMAIL_METRICS],
})
export class MetricsModule {}
