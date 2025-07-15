import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';

export type SendEmailDto = {
  to: string;
  subject: string;
  template: EmailTemplateEnum;
  context: Record<string, unknown>;
};
