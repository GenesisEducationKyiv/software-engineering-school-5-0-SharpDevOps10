import * as Joi from 'joi';

export const subscriptionValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3002).required(),
  DATABASE_URL: Joi.string().uri().required(),
  TOKEN_TTL_HOURS: Joi.number().positive().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  EMAIL_CLIENT_HOST: Joi.string().hostname().required(),
  EMAIL_CLIENT_PORT: Joi.number().port().required(),

  WEATHER_CLIENT_HOST: Joi.string().hostname().required(),
  WEATHER_CLIENT_PORT: Joi.number().port().required(),

  RABBITMQ_HOST: Joi.string().hostname().required(),
  RABBITMQ_PORT: Joi.number().port().required(),

  NODE_ENV: Joi.string().required(),
});
