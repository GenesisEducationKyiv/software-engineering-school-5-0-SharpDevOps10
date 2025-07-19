import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';
import { EmailContext } from '@generated/email';

export type SendEmailDto = {
  to: string;
  subject: string;
  template: EmailTemplateEnum;
  context: EmailContext;
};
