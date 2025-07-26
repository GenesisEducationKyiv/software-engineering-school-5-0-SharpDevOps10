import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { SubscriptionClientService } from './subscription-client.service';
import { GateWayConfigModule } from '../../config/gate-way-config.module';
import { GateWayConfigService } from '../../config/gate-way-config.service';
import { GATEWAY_CLIENT_DI_TOKENS } from '../di-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.SUBSCRIPTION_PACKAGE,
        imports: [GateWayConfigModule],
        useFactory: (config: GateWayConfigService): ClientOptions => {
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
        inject: [GateWayConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: GATEWAY_CLIENT_DI_TOKENS.SUBSCRIPTION_CLIENT,
      useClass: SubscriptionClientService,
    },
  ],
  exports: [
    GATEWAY_CLIENT_DI_TOKENS.SUBSCRIPTION_CLIENT,
  ],

})
export class SubscriptionClientModule {}
