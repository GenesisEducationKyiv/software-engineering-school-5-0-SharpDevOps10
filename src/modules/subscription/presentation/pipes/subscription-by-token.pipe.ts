import { Inject, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { ISubscriptionRepository } from '@subscription/application/interfaces/subscription.repository.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';

@Injectable()
export class SubscriptionByTokenPipe implements PipeTransform<string, Promise<Subscription>> {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async transform (token: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) throw new NotFoundException('Token not found');

    return subscription;
  }
}
