import * as Joi from 'joi';

export const gateWayValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3006).required(),

  WEATHER_CLIENT_HOST: Joi.string().hostname().required(),
  WEATHER_CLIENT_PORT: Joi.number().port().required(),

  SUBSCRIPTION_CLIENT_HOST: Joi.string().hostname().required(),
  SUBSCRIPTION_CLIENT_PORT: Joi.number().port().required(),

  NODE_ENV: Joi.string().required(),
});
