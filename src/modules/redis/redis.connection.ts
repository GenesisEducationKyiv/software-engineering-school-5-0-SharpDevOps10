import Redis from 'ioredis';
import { IConfigService } from '@shared/interfaces/config.service.interface';

export const createRedisClient = (configService: IConfigService): Redis => {
  return new Redis({
    host: configService.getRedisHost(),
    port: configService.getRedisPort(),
    retryStrategy: null,
    autoResubscribe: false,
    autoResendUnfulfilledCommands: false,
    lazyConnect: true,
  });
};
