import * as Joi from 'joi';

export const notificationValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3005).required(),

  WEATHER_CLIENT_HOST: Joi.string().hostname().required(),
  WEATHER_CLIENT_PORT: Joi.number().port().required(),

  SUBSCRIPTION_CLIENT_HOST: Joi.string().hostname().required(),
  SUBSCRIPTION_CLIENT_PORT: Joi.number().port().required(),

  EMAIL_CLIENT_HOST: Joi.string().hostname().required(),
  EMAIL_CLIENT_PORT: Joi.number().port().required(),
});
