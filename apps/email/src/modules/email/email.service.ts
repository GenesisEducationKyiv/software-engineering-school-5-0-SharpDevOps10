import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService } from './interfaces/email.service.interface';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService implements IEmailService {
  constructor (private readonly mailerService: MailerService) {}

  async sendEmail ({ to, subject, template, context }: SendEmailDto): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

}
