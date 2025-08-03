import * as Joi from 'joi';

export const emailValidationSchema = Joi.object({
  PORT: Joi.number().port().required(),

  SMTP_HOST: Joi.string().hostname().required(),
  SMTP_PORT: Joi.number().port().default(587).required(),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().min(8).required(),
  MAIL_FROM: Joi.string().required(),

  RABBITMQ_HOST: Joi.string().hostname().required(),
  RABBITMQ_PORT: Joi.number().port().required(),

  NODE_ENV: Joi.string().required(),

  PROMETHEUS_PUSH_GATEWAY_URL: Joi.string().uri().required(),
  PROMETHEUS_METRICS_JOB_NAME: Joi.string().required(),
  PROMETHEUS_METRICS_PUSH_INTERVAL: Joi.number().integer().min(1).default(60).required(),
});
