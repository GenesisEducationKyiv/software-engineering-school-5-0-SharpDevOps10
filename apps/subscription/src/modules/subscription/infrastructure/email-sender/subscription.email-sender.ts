import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionEmailSenderInterface } from '../../application/interfaces/subscription.email-sender.interface';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { ISubscriptionConfigService } from '../../../config/interfaces/subscription-config.service.interface';
import { EmailProducerInterface } from '@utils/modules/producers/email-producer/interfaces/email-producer.interface';
import { EMAIL_PRODUCER_DI_TOKENS } from '@utils/modules/producers/email-producer/di-tokens';
import { EmailTemplateEnum } from '@grpc-types/email-template.enum';

@Injectable()
export class SubscriptionEmailSender implements SubscriptionEmailSenderInterface {
  constructor (
    @Inject(EMAIL_PRODUCER_DI_TOKENS.EMAIL_PRODUCER)
    private readonly emailProducer: EmailProducerInterface,

    @Inject(SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE)
    private readonly configService: ISubscriptionConfigService,
  ) {}

  sendConfirmationEmail (email: string, token: string): void {
    const confirmUrl = `${this.configService.getFrontendUrl()}/api/confirm/${token}`;

    this.emailProducer.sendEmail({
      to: email,
      subject: 'Confirm your weather subscription',
      template: EmailTemplateEnum.CONFIRM,
      context: {
        confirmUrl,
      },
    });
  }

}
