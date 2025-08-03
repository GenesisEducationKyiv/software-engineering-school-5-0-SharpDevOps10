import { Counter, Histogram } from 'prom-client';
import { NOTIFICATION_METRIC_NAMES } from './constants/notification-metric.names';
import { NOTIFICATION_METRIC_HELP } from './constants/notification-metric.helps';

export const notificationMetrics = {
  emailSendAttempts: new Counter({
    name: NOTIFICATION_METRIC_NAMES.EMAIL_SEND_ATTEMPTS,
    help: NOTIFICATION_METRIC_HELP.EMAIL_SEND_ATTEMPTS,
    labelNames: ['status', 'frequency'],
  }),

  emailResponseTime: new Histogram({
    name: NOTIFICATION_METRIC_NAMES.EMAIL_RESPONSE_TIME,
    help: NOTIFICATION_METRIC_HELP.EMAIL_RESPONSE_TIME,
    buckets: [0.05, 0.1, 0.5, 1, 2, 5],
    labelNames: ['frequency'],
  }),

  subscriptionFetchAttempts: new Counter({
    name: NOTIFICATION_METRIC_NAMES.SUBSCRIPTION_FETCH_ATTEMPTS,
    help: NOTIFICATION_METRIC_HELP.SUBSCRIPTION_FETCH_ATTEMPTS,
    labelNames: ['status', 'frequency'],
  }),

  fetchResponseTime: new Histogram({
    name: NOTIFICATION_METRIC_NAMES.FETCH_RESPONSE_TIME,
    help: NOTIFICATION_METRIC_HELP.FETCH_RESPONSE_TIME,
    buckets: [0.05, 0.1, 0.5, 1, 2, 5],
    labelNames: ['frequency'],
  }),
};
