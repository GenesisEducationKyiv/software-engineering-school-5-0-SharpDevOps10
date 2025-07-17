import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { MetricsModule } from '@utils/modules/metrics/metrics.module';
import { REDIS_DI_TOKENS } from './di-tokens';
import { createRedisClient } from '@utils/modules/redis/redis.connection';

@Module({
  imports: [ConfigModule, MetricsModule],
  providers: [
    RedisService,
    {
      provide: REDIS_DI_TOKENS.REDIS_CLIENT,
      useFactory: (configService: ConfigService): Redis => createRedisClient(configService),
      inject: [ConfigService],
    },
    {
      provide: REDIS_DI_TOKENS.REDIS_SERVICE,
      useExisting: RedisService,
    },
  ],
  exports: [RedisService, REDIS_DI_TOKENS.REDIS_SERVICE],
})
export class RedisModule {}
