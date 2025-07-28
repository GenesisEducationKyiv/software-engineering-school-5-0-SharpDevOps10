import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailServiceInterface } from './interfaces/email.service.interface';
import { SendEmailDto } from '@shared-types/amqp/send-email.dto';
import { EmailTemplateValidatorInterface } from './interfaces/email-template.validator.interface';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';

@Injectable()
export class EmailService implements EmailServiceInterface {
  constructor (
    private readonly mailerService: MailerService,

    @Inject(EMAIL_DI_TOKENS.EMAIL_TEMPLATE_VALIDATOR)
    private readonly templateValidator: EmailTemplateValidatorInterface,
  ) {}

  async sendEmail ({ to, subject, template, context }: SendEmailDto): Promise<void> {
    this.templateValidator.validate(template);

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

}
