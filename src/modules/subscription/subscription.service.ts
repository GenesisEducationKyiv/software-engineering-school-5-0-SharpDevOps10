import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { randomUUID } from 'node:crypto';
import { IEmailService } from '@email/interfaces/email-service.interface';
import { isTokenExpired } from '@utils/date/is-token-expired';
import type { Subscription } from '@prisma/client';
import type { ISubscriptionService } from '@subscription/interfaces/subscription.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    const { email, city } = dto;
    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new ConflictException('Email already subscribed for this city');

    const token = randomUUID();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    await this.emailService.sendConfirmationEmail(email, token);
  }

  async confirm (subscription: Subscription): Promise<void> {
    if (subscription.confirmed) throw new ConflictException('Subscription already confirmed');
    if (isTokenExpired(subscription.createdAt)) throw new BadRequestException('Invalid token');

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
