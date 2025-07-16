import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { SubscriptionConfigService } from '../../config/subscription-config.service';
import { SUBSCRIPTION_DI_TOKENS } from '../../subscription/constants/di-tokens';
import { EmailClientService } from './email-client.service';
import { SubscriptionConfigModule } from '../../config/subscription-config.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.EMAIL_PACKAGE,
        imports: [SubscriptionConfigModule],
        useFactory: (config: SubscriptionConfigService): ClientOptions => {
          const host = config.getEmailClientHost();
          const port = config.getEmailClientPort();

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: 'email',
              protoPath: 'libs/proto/email.proto',
            },
          };
        },
        inject: [SubscriptionConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: SUBSCRIPTION_DI_TOKENS.EMAIL_CLIENT,
      useClass: EmailClientService,
    },
  ],
  exports: [SUBSCRIPTION_DI_TOKENS.EMAIL_CLIENT],
})
export class EmailClientModule {}
