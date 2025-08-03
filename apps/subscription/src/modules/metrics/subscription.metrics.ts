import { Counter, Gauge, Histogram } from 'prom-client';
import { SUBSCRIPTION_METRIC_NAMES } from './constants/subscription-metric.names';
import { SUBSCRIPTION_METRIC_HELP } from './constants/subscription-metric.helps';

export const subscriptionMetrics = {
  created: new Counter({
    name: SUBSCRIPTION_METRIC_NAMES.CREATED,
    help: SUBSCRIPTION_METRIC_HELP.CREATED,
    labelNames: ['status'],
  }),

  confirmed: new Counter({
    name: SUBSCRIPTION_METRIC_NAMES.CONFIRMED,
    help: SUBSCRIPTION_METRIC_HELP.CONFIRMED,
  }),

  deleted: new Counter({
    name: SUBSCRIPTION_METRIC_NAMES.DELETED,
    help: SUBSCRIPTION_METRIC_HELP.DELETED,
  }),

  processingDuration: new Histogram({
    name: SUBSCRIPTION_METRIC_NAMES.PROCESSING_DURATION,
    help: SUBSCRIPTION_METRIC_HELP.PROCESSING_DURATION,
    buckets: [0.01, 0.1, 0.5, 1, 2, 5],
  }),

  count: new Gauge({
    name: SUBSCRIPTION_METRIC_NAMES.COUNT,
    help: SUBSCRIPTION_METRIC_HELP.COUNT,
    labelNames: ['confirmed'],
  }),

  cityValidationFail: new Counter({
    name: SUBSCRIPTION_METRIC_NAMES.CITY_VALIDATION_FAIL,
    help: SUBSCRIPTION_METRIC_HELP.CITY_VALIDATION_FAIL,
  }),

  invalidToken: new Counter({
    name: SUBSCRIPTION_METRIC_NAMES.INVALID_TOKEN,
    help: SUBSCRIPTION_METRIC_HELP.INVALID_TOKEN,
  }),
};
