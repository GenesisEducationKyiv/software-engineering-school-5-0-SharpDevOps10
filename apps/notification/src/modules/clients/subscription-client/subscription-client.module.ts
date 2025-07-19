import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { NotificationConfigModule } from '../../config/notification-config.module';
import { NotificationConfigService } from '../../config/notification-config.service';
import { NOTIFICATION_DI_TOKENS } from '../../notification/di-tokens';
import { SubscriptionClientService } from './subscription-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.SUBSCRIPTION_PACKAGE,
        imports: [NotificationConfigModule],
        useFactory: (config: NotificationConfigService): ClientOptions => {
          const host = config.getSubscriptionClientHost();
          const port = config.getSubscriptionClientPort();

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: GRPC_PACKAGES.SUBSCRIPTION,
              protoPath: GRPC_PROTO_PATH.SUBSCRIPTION,
            },
          };
        },
        inject: [NotificationConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: NOTIFICATION_DI_TOKENS.SUBSCRIPTION_CLIENT,
      useClass: SubscriptionClientService,
    },
  ],
  exports: [
    NOTIFICATION_DI_TOKENS.SUBSCRIPTION_CLIENT,
  ],

})
export class SubscriptionClientModule {}
