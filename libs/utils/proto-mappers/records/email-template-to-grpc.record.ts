import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';

export const emailTemplateToGrpcMap: Record<EmailTemplateEnum, string> = {
  [EmailTemplateEnum.CONFIRM]: 'confirm',
  [EmailTemplateEnum.WEATHER_UPDATE]: 'weather-update',
};
