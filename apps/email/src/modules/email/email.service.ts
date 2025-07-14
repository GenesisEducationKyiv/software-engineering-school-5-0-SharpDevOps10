import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService } from './interfaces/email.service.interface';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';
import { EMAIL_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { IEmailConfigService } from '../config/interfaces/email-confige.service.interface';
import { SendConfirmationEmailDto } from './dto/send-confirmation-email.dto';
import { SendWeatherUpdateEmailDto } from './dto/send-weather-update-email.dto';

@Injectable()
export class EmailService implements IEmailService {
  constructor (
    private readonly mailerService: MailerService,

    @Inject(EMAIL_CONFIG_DI_TOKENS.EMAIL_CONFIG_SERVICE)
    private readonly configService: IEmailConfigService,
  ) {}

  async sendConfirmationEmail ({ email, token }: SendConfirmationEmailDto): Promise<void> {
    const confirmUrl = `${this.configService.getFrontendUrl()}/api/confirm/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your weather subscription',
      template: 'confirm',
      context: {
        confirmUrl,
      },
    });
  }

  async sendWeatherUpdateEmail ({
    email,
    city,
    weather,
    frequency,
  }: SendWeatherUpdateEmailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: `Weather update for ${ city }`,
      template: 'weather-update',
      context: {
        city,
        frequency,
        ...weather,
      },
    });
  }
}
