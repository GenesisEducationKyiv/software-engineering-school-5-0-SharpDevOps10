import { SendEmailDto } from '@shared-types/amqp/send-email.dto';

export interface EmailProducerInterface {
  sendEmail(dto: SendEmailDto): void;
}
