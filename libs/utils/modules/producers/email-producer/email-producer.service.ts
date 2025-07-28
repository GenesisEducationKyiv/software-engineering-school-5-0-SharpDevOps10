import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_PRODUCER_DI_TOKENS } from './di-tokens';
import { EMAIL_EVENT_PATTERNS } from '@utils/constants/brokers/email-event.patterns';
import { SendEmailDto } from '@shared-types/amqp/send-email.dto';
import { EmailProducerInterface } from './interfaces/email-producer.interface';

@Injectable()
export class EmailProducerService implements EmailProducerInterface {
  constructor (
    @Inject(EMAIL_PRODUCER_DI_TOKENS.EMAIL_BROKER_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  sendEmail (dto: SendEmailDto): void {
    this.client.emit(EMAIL_EVENT_PATTERNS.SEND_EMAIL, dto);
  }
}
