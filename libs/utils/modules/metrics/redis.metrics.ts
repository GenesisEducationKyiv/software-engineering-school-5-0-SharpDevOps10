import { Counter, Histogram } from 'prom-client';
import { REDIS_METRIC_NAMES } from './constants/metric-names';
import { REDIS_METRIC_HELP } from './constants/metric-helps';

export const redisMetrics = {
  requests: new Counter({
    name: REDIS_METRIC_NAMES.REQUESTS_TOTAL,
    help: REDIS_METRIC_HELP.REQUESTS_TOTAL,
  }),
  hits: new Counter({
    name: REDIS_METRIC_NAMES.HITS_TOTAL,
    help: REDIS_METRIC_HELP.HITS_TOTAL,
  }),
  misses: new Counter({
    name: REDIS_METRIC_NAMES.MISSES_TOTAL,
    help: REDIS_METRIC_HELP.MISSES_TOTAL,
  }),
  errors: new Counter({
    name: REDIS_METRIC_NAMES.ERRORS_TOTAL,
    help: REDIS_METRIC_HELP.ERRORS_TOTAL,
  }),
  responseTime: new Histogram({
    name: REDIS_METRIC_NAMES.RESPONSE_TIME_SECONDS,
    help: REDIS_METRIC_HELP.RESPONSE_TIME_SECONDS,
    buckets: [0.001, 0.01, 0.1, 0.5, 1, 2],
  }),

  writes: new Counter({
    name: REDIS_METRIC_NAMES.WRITES_TOTAL,
    help: REDIS_METRIC_HELP.WRITES_TOTAL,
  }),
  writeErrors: new Counter({
    name: REDIS_METRIC_NAMES.WRITE_ERRORS_TOTAL,
    help: REDIS_METRIC_HELP.WRITE_ERRORS_TOTAL,
  }),
  writeResponseTime: new Histogram({
    name: REDIS_METRIC_NAMES.WRITE_RESPONSE_TIME_SECONDS,
    help: REDIS_METRIC_HELP.WRITE_RESPONSE_TIME_SECONDS,
    buckets: [0.001, 0.01, 0.1, 0.5, 1, 2],
  }),
};
