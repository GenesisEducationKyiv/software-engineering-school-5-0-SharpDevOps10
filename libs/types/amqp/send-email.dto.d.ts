import { EmailTemplateEnum } from '../grpc/common/email-template.enum';
import { EmailContext } from './email.context';

export type SendEmailDto = {
  to: string;
  subject: string;
  template: EmailTemplateEnum;
  context: EmailContext;
};
