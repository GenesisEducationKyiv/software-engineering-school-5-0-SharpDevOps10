import { Counter, Histogram } from 'prom-client';
import { EMAIL_METRIC_NAMES } from './constants/email-metrics.names';
import { EMAIL_METRIC_HELP } from './constants/email-metrics.helps';

export const emailMetrics = {
  sendTotal: new Counter({
    name: EMAIL_METRIC_NAMES.EMAIL_SEND_TOTAL,
    help: EMAIL_METRIC_HELP.EMAIL_SEND_TOTAL,
    labelNames: ['status', 'template'],
  }),

  sendDuration: new Histogram({
    name: EMAIL_METRIC_NAMES.EMAIL_SEND_DURATION,
    help: EMAIL_METRIC_HELP.EMAIL_SEND_DURATION,
    buckets: [0.05, 0.1, 0.5, 1, 2, 5],
    labelNames: ['template'],
  }),

  eventsProcessed: new Counter({
    name: EMAIL_METRIC_NAMES.EMAIL_EVENTS_PROCESSED,
    help: EMAIL_METRIC_HELP.EMAIL_EVENTS_PROCESSED,
  }),

  templateValidationFailures: new Counter({
    name: EMAIL_METRIC_NAMES.TEMPLATE_VALIDATION_FAILURES,
    help: EMAIL_METRIC_HELP.TEMPLATE_VALIDATION_FAILURES,
    labelNames: ['template'],
  }),
};
