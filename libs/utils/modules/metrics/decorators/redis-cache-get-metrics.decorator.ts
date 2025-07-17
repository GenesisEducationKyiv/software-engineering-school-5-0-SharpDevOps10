import { redisMetrics } from '@utils/modules/metrics/redis.metrics';

export function RedisCacheGetMetrics () {
  return function (
    _: object,
    __: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      redisMetrics.requests.inc();
      const end = redisMetrics.responseTime.startTimer();

      try {
        const result = await originalMethod.apply(this, args);

        if (result !== null && result !== undefined) redisMetrics.hits.inc();
        else redisMetrics.misses.inc();

        return result;
      } catch (err) {
        redisMetrics.errors.inc();
        throw err;
      } finally {
        end();
      }
    };

    return descriptor;
  };
}
