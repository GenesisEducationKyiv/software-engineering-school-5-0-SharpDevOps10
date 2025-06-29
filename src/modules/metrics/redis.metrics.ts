import { Counter, Histogram } from 'prom-client';
import { REDIS_METRIC_NAMES } from '@metrics/metric-names';

export const redisMetrics = {
  requests: new Counter({
    name: REDIS_METRIC_NAMES.REQUESTS_TOTAL,
    help: 'Total Redis cache requests',
  }),
  hits: new Counter({
    name: REDIS_METRIC_NAMES.HITS_TOTAL,
    help: 'Total Redis cache hits',
  }),
  misses: new Counter({
    name: REDIS_METRIC_NAMES.MISSES_TOTAL,
    help: 'Total Redis cache misses',
  }),
  errors: new Counter({
    name: REDIS_METRIC_NAMES.ERRORS_TOTAL,
    help: 'Total Redis cache errors',
  }),
  responseTime: new Histogram({
    name: REDIS_METRIC_NAMES.RESPONSE_TIME_SECONDS,
    help: 'Redis response time in seconds',
    buckets: [0.001, 0.01, 0.1, 0.5, 1, 2],
  }),
};
