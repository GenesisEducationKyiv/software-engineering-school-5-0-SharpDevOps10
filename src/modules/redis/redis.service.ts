import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { IRedisService } from '@redis/interfaces/redis.service.interface';
import { REDIS_DI_TOKENS } from './di-tokens';
import Redis from 'ioredis';
import { RedisCacheGetMetrics } from '@metrics/decorators/redis-cache-get-metrics.decorator';
import { RedisCacheSetMetrics } from '@metrics/decorators/redis-cache-set-metrics.decorator';

@Injectable()
export class RedisService implements OnModuleDestroy, IRedisService {
  constructor (
    @Inject(REDIS_DI_TOKENS.REDIS_CLIENT)
    private readonly client: Redis,
  ) {}

  @RedisCacheGetMetrics()
  async get<T> (key: string): Promise<T | null> {
    const data = await this.client.get(key);
    
    return data ? JSON.parse(data) : null;
  }

  @RedisCacheSetMetrics()
  async set<T> (key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del (key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy (): Promise<void> {
    try {
      if (this.client.status === 'ready') {
        await this.client.quit();
      }
    } finally {
      this.client.disconnect();
    }
  }
}
