import { Module } from '@nestjs/common';
import { METRIC_DI_TOKENS } from '@utils/modules/metrics/di-tokens';
import { redisMetrics } from '@utils/modules/metrics/redis.metrics';

@Module({
  providers: [
    {
      provide: METRIC_DI_TOKENS.REDIS_METRICS,
      useValue: redisMetrics,
    },
  ],
  exports: [METRIC_DI_TOKENS.REDIS_METRICS],
})
export class MetricsModule {}
