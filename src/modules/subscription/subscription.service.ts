import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import type { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import type { IEmailService } from '@email/interfaces/email-service.interface';
import type { ITokenService } from '@subscription/interfaces/token.service.interface';
import type { Subscription } from '@prisma/client';
import type { ISubscriptionService } from '@subscription/interfaces/subscription.service.interface';
import type { ISubscriptionNotifier } from '@subscription/interfaces/subscription.notifier.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';

@Injectable()
export class SubscriptionService implements ISubscriptionService, ISubscriptionNotifier {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    const { email, city } = dto;
    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new ConflictException('Email already subscribed for this city');

    const token = this.tokenService.generateToken();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    await this.emailService.sendConfirmationEmail(email, token);
  }

  async confirm (subscription: Subscription): Promise<void> {
    if (subscription.confirmed) {
      throw new ConflictException('Subscription already confirmed');
    }

    if (this.tokenService.isTokenExpired(subscription.createdAt)) {
      throw new BadRequestException('Invalid token');
    }

    await this.subscriptionRepository.updateSubscription(subscription.id, {
      confirmed: true,
    });
  }

  async unsubscribe (subscription: Subscription): Promise<void> {
    if (!subscription.confirmed) throw new ConflictException('Subscription not confirmed');

    await this.subscriptionRepository.deleteSubscription(subscription.id);
  }

  async getConfirmedSubscriptions (): Promise<Subscription[]> {
    return this.subscriptionRepository.getConfirmedSubscriptions();
  }
}
