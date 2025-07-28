import { SendEmailDto } from '@amqp-types/send-email.dto';

export interface EmailProducerInterface {
  sendEmail(dto: SendEmailDto): void;
}
