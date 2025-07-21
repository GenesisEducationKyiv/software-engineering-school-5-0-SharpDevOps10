import { Module } from '@nestjs/common';
import { SubscriptionClientModule } from '../clients/subscription-client/subscription-client.module';
import { SubscriptionController } from './subscription.controller';
import { SUBSCRIPTION_DI_TOKENS } from './di-tokens';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    SubscriptionClientModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
  ],
})
export class SubscriptionModule {}
