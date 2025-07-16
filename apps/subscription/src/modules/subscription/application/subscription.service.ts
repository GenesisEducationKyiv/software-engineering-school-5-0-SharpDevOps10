import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionService } from './interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { ITokenService } from './interfaces/token.service.interface';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { ISubscriptionEmailSender } from './interfaces/subscription.email-sender.interface';
import { SubscriptionConfirmedException } from '../../../exceptions/subscription-confirmed.exception';
import { EmailSubscribedException } from '../../../exceptions/email-subscribed.exception';
import { InvalidTokenException } from '../../../exceptions/invalid-token.exception';
import { SubscriptionNotConfirmedException } from '../../../exceptions/subscription-not-confirmed.exception';
import { TokenNotFoundException } from '../../../exceptions/token-not-found.exception';
import { SubscriptionFrequencyEnum } from '../domain/enums/subscription-frequency.enum';
import { InvalidFrequencyException } from '../../../exceptions/invalid-frequency.exception';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_EMAIL_SENDER)
    private readonly emailService: ISubscriptionEmailSender,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    this.validateFrequency(dto.frequency);

    const { email, city } = dto;

    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new EmailSubscribedException();

    const token = this.tokenService.generateToken();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    await this.emailService.sendConfirmationEmail(email, token);
  }

  async confirm (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (subscription.confirmed) {
      throw new SubscriptionConfirmedException();
    }

    if (this.tokenService.isTokenExpired(subscription.createdAt)) {
      throw new InvalidTokenException();
    }

    await this.subscriptionRepository.updateSubscription(subscription.id, {
      confirmed: true,
    });
  }

  async unsubscribe (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (!subscription.confirmed) throw new SubscriptionNotConfirmedException();

    await this.subscriptionRepository.deleteSubscription(subscription.id);
  }

  async getConfirmedSubscriptions (): Promise<Subscription[]> {
    return this.subscriptionRepository.getConfirmedSubscriptions();
  }

  private async getSubscriptionByToken (token: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) throw new TokenNotFoundException();

    return subscription;
  }

  private validateFrequency (frequency: string): void {
    if (!Object.values(SubscriptionFrequencyEnum).includes(frequency as SubscriptionFrequencyEnum)) {
      throw new InvalidFrequencyException();
    }
  }
}
