import { SendEmailDto } from '@amqp-types/send-email.dto';

export interface EmailServiceInterface {
  sendEmail(dto: SendEmailDto): Promise<void>;
}
