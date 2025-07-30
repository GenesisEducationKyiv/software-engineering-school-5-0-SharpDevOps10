import * as Joi from 'joi';

export const emailValidationSchema = Joi.object({
  SMTP_HOST: Joi.string().hostname().required(),
  SMTP_PORT: Joi.number().port().default(587).required(),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().min(8).required(),
  MAIL_FROM: Joi.string().required(),

  RABBITMQ_HOST: Joi.string().hostname().required(),
  RABBITMQ_PORT: Joi.number().port().required(),
});
