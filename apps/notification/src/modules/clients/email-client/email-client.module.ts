import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { EmailClientService } from './email-client.service';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { NotificationConfigModule } from '../../config/notification-config.module';
import { NotificationConfigService } from '../../config/notification-config.service';
import { NOTIFICATION_DI_TOKENS } from '../../notification/di-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.EMAIL_PACKAGE,
        imports: [NotificationConfigModule],
        useFactory: (config: NotificationConfigService): ClientOptions => {
          const host = config.getEmailClientHost();
          const port = config.getEmailClientPort();

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: GRPC_PACKAGES.EMAIL,
              protoPath: GRPC_PROTO_PATH.EMAIL,
            },
          };
        },
        inject: [NotificationConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: NOTIFICATION_DI_TOKENS.EMAIL_CLIENT,
      useClass: EmailClientService,
    },
  ],
  exports: [
    NOTIFICATION_DI_TOKENS.EMAIL_CLIENT,
  ],
})
export class EmailClientModule {}
