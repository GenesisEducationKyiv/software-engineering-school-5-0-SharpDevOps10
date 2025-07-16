import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionEmailSender } from '../../application/interfaces/subscription.email-sender.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../../constants/di-tokens';
import { IEmailClient } from '@shared-types/email/email-client.interface';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { ISubscriptionConfigService } from '../../../config/interfaces/subscription-config.service.interface';
import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';

@Injectable()
export class SubscriptionEmailSender implements ISubscriptionEmailSender {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.EMAIL_CLIENT)
    private readonly emailClient: IEmailClient,

    @Inject(SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE)
    private readonly configService: ISubscriptionConfigService,
  ) {}

  async sendConfirmationEmail (email: string, token: string): Promise<void> {
    const confirmUrl = `${this.configService.getFrontendUrl()}/api/confirm/${token}`;

    await this.emailClient.sendEmail({
      to: email,
      subject: 'Confirm your weather subscription',
      template: EmailTemplateEnum.CONFIRM,
      context: {
        confirmUrl,
      },
    });
  }

}
