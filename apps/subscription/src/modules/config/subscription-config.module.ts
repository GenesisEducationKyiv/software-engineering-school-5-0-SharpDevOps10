import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { subscriptionValidationSchema } from './subscription-validation.schema';
import { SubscriptionConfigService } from './subscription-config.service';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['apps/subscription/.env'],
      validationSchema: subscriptionValidationSchema,
    }),
  ],
  providers: [
    SubscriptionConfigService,
    {
      provide: SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE,
      useExisting: SubscriptionConfigService,
    },
  ],
  exports: [SubscriptionConfigService, SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE],
})
export class SubscriptionConfigModule {}
