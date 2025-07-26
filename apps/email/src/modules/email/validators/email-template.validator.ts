import { Injectable } from '@nestjs/common';
import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';
import { InvalidArgumentException } from '@exceptions/grpc-exceptions';
import { EmailTemplateValidatorInterface } from '../interfaces/email-template.validator.interface';

@Injectable()
export class EmailTemplateValidator implements EmailTemplateValidatorInterface {
  validate (template: string): void {
    const allowed = Object.values(EmailTemplateEnum);
    if (!allowed.includes(template as EmailTemplateEnum)) {
      throw new InvalidArgumentException(
        `Invalid email template "${template}". Allowed templates: ${allowed.join(', ')}`
      );
    }
  }
}
