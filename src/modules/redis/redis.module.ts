import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@config/config.module';
import { REDIS_DI_TOKENS } from '@redis/di-tokens';
import { createRedisClient } from '@redis/redis.connection';
import { CONFIG_DI_TOKENS } from '@config/di-tokens';
import { IConfigService } from '@config/config.service.interface';
import Redis from 'ioredis';
import { MetricsModule } from '@modules/metrics/metrics.module';

@Module({
  imports: [ConfigModule, MetricsModule],
  providers: [
    RedisService,
    {
      provide: REDIS_DI_TOKENS.REDIS_CLIENT,
      useFactory: (configService: IConfigService): Redis => createRedisClient(configService),
      inject: [CONFIG_DI_TOKENS.CONFIG_SERVICE],
    },
    {
      provide: REDIS_DI_TOKENS.REDIS_SERVICE,
      useExisting: RedisService,
    },
  ],
  exports: [RedisService, REDIS_DI_TOKENS.REDIS_SERVICE],
})
export class RedisModule {}
