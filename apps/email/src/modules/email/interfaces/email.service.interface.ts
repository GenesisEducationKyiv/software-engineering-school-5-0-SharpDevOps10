import { SendEmailDto } from '@shared-types/amqp/send-email.dto';

export interface EmailServiceInterface {
  sendEmail(dto: SendEmailDto): Promise<void>;
}
