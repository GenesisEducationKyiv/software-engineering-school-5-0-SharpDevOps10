import { Module, Global } from '@nestjs/common';
import { MetricsController } from '@metrics/metrics.controller';
import { redisMetrics } from '@metrics/redis.metrics';
import { METRIC_DI_TOKENS } from '@metrics/di-tokens';

@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    {
      provide: METRIC_DI_TOKENS.REDIS_METRICS,
      useValue: redisMetrics,
    },
  ],
  exports: [METRIC_DI_TOKENS.REDIS_METRICS],
})
export class MetricsModule {}
