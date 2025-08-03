import * as Joi from 'joi';

export const subscriptionValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3002).required(),
  DATABASE_URL: Joi.string().uri().required(),

  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),

  TOKEN_TTL_HOURS: Joi.number().positive().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  WEATHER_CLIENT_HOST: Joi.string().hostname().required(),
  WEATHER_CLIENT_PORT: Joi.number().port().required(),

  RABBITMQ_HOST: Joi.string().hostname().required(),
  RABBITMQ_PORT: Joi.number().port().required(),

  NODE_ENV: Joi.string().required(),

  PROMETHEUS_PUSH_GATEWAY_URL: Joi.string().uri().required(),
  PROMETHEUS_METRICS_JOB_NAME: Joi.string().required(),
  PROMETHEUS_METRICS_PUSH_INTERVAL: Joi.number().positive().required(),
});
