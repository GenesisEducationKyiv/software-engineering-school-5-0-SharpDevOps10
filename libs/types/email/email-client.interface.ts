import { SendEmailRequest } from '@generated/email';
import { Empty } from '@generated/common/empty';

export interface IEmailClient {
  sendEmail(dto: SendEmailRequest): Promise<Empty>;
}
