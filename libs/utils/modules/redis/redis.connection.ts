import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const createRedisClient = (configService: ConfigService): Redis => {
  return new Redis({
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: configService.getOrThrow<number>('REDIS_PORT'),
    retryStrategy: null,
    autoResubscribe: false,
    autoResendUnfulfilledCommands: false,
    lazyConnect: true,
  });
};
