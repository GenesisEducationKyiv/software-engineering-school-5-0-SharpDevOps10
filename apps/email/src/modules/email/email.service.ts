import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService } from './interfaces/email.service.interface';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';
import { InvalidArgumentException } from '@exceptions/grpc-exceptions';

@Injectable()
export class EmailService implements IEmailService {
  constructor (private readonly mailerService: MailerService) {}

  async sendEmail ({ to, subject, template, context }: SendEmailDto): Promise<void> {
    this.validateTemplates(template);

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  private validateTemplates (template: string): void {
    const allowed = Object.values(EmailTemplateEnum);

    if (!allowed.includes(template as EmailTemplateEnum)) {
      throw new InvalidArgumentException(
        `Invalid email template "${template}". Allowed templates: ${allowed.join(', ')}`
      );
    }
  }

}
