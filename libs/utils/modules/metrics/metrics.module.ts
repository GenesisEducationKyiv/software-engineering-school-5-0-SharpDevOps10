import { Module, Global } from '@nestjs/common';
import { MetricsController } from '@utils/modules/metrics/metrics.controller';
import { METRIC_DI_TOKENS } from '@utils/modules/metrics/di-tokens';
import { redisMetrics } from '@utils/modules/metrics/redis.metrics';

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
