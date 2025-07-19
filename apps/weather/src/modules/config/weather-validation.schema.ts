import * as Joi from 'joi';
import { validateWeatherProvidersPriority } from './validators/validate-weather-providers-priority';

export const weatherValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3003).required(),
  WEATHER_API_KEY: Joi.string().min(1).required(),
  WEATHER_API_BASE_URL: Joi.string().uri().required(),

  VISUAL_CROSSING_API_KEY: Joi.string().min(1).required(),
  VISUAL_CROSSING_BASE_URL: Joi.string().uri().required(),

  WEATHER_PROVIDERS_PRIORITY: Joi.string().required()
    .custom(validateWeatherProvidersPriority),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_TTL: Joi.number().integer().positive().default(600).required(),
});
