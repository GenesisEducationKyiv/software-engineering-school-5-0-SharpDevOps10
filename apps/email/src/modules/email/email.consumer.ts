import { Controller, Inject } from '@nestjs/common';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { EmailServiceInterface } from './interfaces/email.service.interface';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EMAIL_EVENT_PATTERNS } from '@utils/constants/brokers/email-event.patterns';
import { SendEmailDto } from '@shared-types/amqp/send-email.dto';

@Controller()
export class EmailConsumer {
  constructor (
    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: EmailServiceInterface,
  ) {}

  @EventPattern(EMAIL_EVENT_PATTERNS.SEND_EMAIL)
  async handleSendEmail (@Payload() data: SendEmailDto): Promise<void> {
    await this.emailService.sendEmail(data);
  }
}
