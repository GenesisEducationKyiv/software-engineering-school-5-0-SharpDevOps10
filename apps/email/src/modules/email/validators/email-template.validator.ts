import { Injectable } from '@nestjs/common';
import { EmailTemplateValidatorInterface } from '../interfaces/email-template.validator.interface';
import { EmailInvalidArgumentException } from '@exceptions/amqp-exceptions';
import { EmailTemplateEnum } from '@grpc-types/email-template.enum';

@Injectable()
export class EmailTemplateValidator implements EmailTemplateValidatorInterface {
  validate (template: string): void {
    const allowed = Object.values(EmailTemplateEnum);
    if (!allowed.includes(template as EmailTemplateEnum)) {
      throw new EmailInvalidArgumentException(
        `Invalid email template "${template}". Allowed templates: ${allowed.join(', ')}`
      );
    }
  }
}
