import * as Joi from 'joi';

export const notificationValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3005).required(),

  WEATHER_CLIENT_HOST: Joi.string().hostname().required(),
  WEATHER_CLIENT_PORT: Joi.number().port().required(),

  SUBSCRIPTION_CLIENT_HOST: Joi.string().hostname().required(),
  SUBSCRIPTION_CLIENT_PORT: Joi.number().port().required(),

  RABBITMQ_HOST: Joi.string().hostname().required(),
  RABBITMQ_PORT: Joi.number().port().required(),

  SUBSCRIPTION_PRODUCER_TIMEOUT: Joi.number().required(),

  PROMETHEUS_PUSH_GATEWAY_URL: Joi.string().required(),
  PROMETHEUS_METRICS_JOB_NAME: Joi.string().required(),
  PROMETHEUS_METRICS_PUSH_INTERVAL: Joi.number().required(),
});
