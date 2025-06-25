import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  TOKEN_TTL_HOURS: Joi.number().positive().required(),

  WEATHER_API_KEY: Joi.string().min(1).required(),
  WEATHER_API_BASE_URL: Joi.string().uri().required(),

  VISUAL_CROSSING_API_KEY: Joi.string().min(1).required(),
  VISUAL_CROSSING_BASE_URL: Joi.string().uri().required(),
});
