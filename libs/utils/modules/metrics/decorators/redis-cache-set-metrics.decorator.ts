import { redisMetrics } from '@utils/modules/metrics/redis.metrics';

export function RedisCacheSetMetrics () {
  return (_: object, __: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const original = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      redisMetrics.writes.inc();
      const end = redisMetrics.writeResponseTime.startTimer();
      try {
        return await original.apply(this, args);
      } catch (e) {
        redisMetrics.writeErrors.inc();
        throw e;
      } finally {
        end();
      }
    };
    
    return descriptor;
  };
}

