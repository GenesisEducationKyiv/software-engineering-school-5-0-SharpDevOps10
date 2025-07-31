import { Controller, Inject } from '@nestjs/common';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { EmailServiceInterface } from './interfaces/email.service.interface';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EMAIL_EVENT_PATTERNS } from '@utils/constants/brokers/email-event.patterns';
import { SendEmailDto } from '@amqp-types/send-email.dto';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Controller()
export class EmailConsumer {
  constructor (
    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: EmailServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {}

  @EventPattern(EMAIL_EVENT_PATTERNS.SEND_EMAIL)
  async handleSendEmail (@Payload() data: SendEmailDto): Promise<void> {
    this.logger.info('Received SEND_EMAIL event', {
      context: this.constructor.name,
      method: this.handleSendEmail.name,
    });

    await this.emailService.sendEmail(data);

    this.logger.info('Finished processing SEND_EMAIL', {
      context: this.constructor.name,
      method: this.handleSendEmail.name,
    });
  }
}
