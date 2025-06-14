import { Inject, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { ISubscriptionRepository } from '@subscription/interfaces/subscription.repository.interface';

@Injectable()
export class SubscriptionByTokenPipe implements PipeTransform<string, Promise<Subscription>> {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async transform (token: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) throw new NotFoundException('Token not found');

    return subscription;
  }
}
