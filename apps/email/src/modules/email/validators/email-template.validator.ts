import { Injectable } from '@nestjs/common';
import { EmailTemplateEnum } from '@shared-types/grpc/common/email-template.enum';
import { EmailTemplateValidatorInterface } from '../interfaces/email-template.validator.interface';
import { EmailInvalidArgumentException } from '@exceptions/amqp-exceptions';

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
