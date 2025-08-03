import { Counter, Gauge, Histogram } from 'prom-client';

export const subscriptionMetrics = {
  created: new Counter({
    name: 'subscription_created_total',
    help: 'Total subscription creation attempts',
    labelNames: ['status'],
  }),

  confirmed: new Counter({
    name: 'subscription_confirmed_total',
    help: 'Total confirmed subscriptions',
  }),

  deleted: new Counter({
    name: 'subscription_deleted_total',
    help: 'Total deleted subscriptions',
  }),

  processingDuration: new Histogram({
    name: 'subscription_processing_duration_seconds',
    help: 'Duration of subscription processing in seconds',
    buckets: [0.01, 0.1, 0.5, 1, 2, 5],
  }),

  count: new Gauge({
    name: 'subscription_count',
    help: 'Current number of subscriptions',
    labelNames: ['confirmed'],
  }),

  cityValidationFail: new Counter({
    name: 'city_validation_fail_total',
    help: 'Total failed city validation attempts',
  }),

  invalidToken: new Counter({
    name: 'invalid_token_total',
    help: 'Total invalid token uses during confirmation/unsubscribe',
  }),
};
