import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';

export const grpcToEmailTemplate: Record<string, EmailTemplateEnum> = {
  'confirm': EmailTemplateEnum.CONFIRM,
  'weather-update': EmailTemplateEnum.WEATHER_UPDATE,
};
