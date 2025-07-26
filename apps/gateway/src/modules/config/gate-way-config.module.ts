import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { gateWayValidationSchema } from './gate-way-validation.schema';
import { GateWayConfigService } from './gate-way-config.service';
import { GATEWAY_CONFIG_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['apps/gateway/.env'],
      validationSchema: gateWayValidationSchema,
    }),
  ],
  providers: [
    GateWayConfigService,
    {
      provide: GATEWAY_CONFIG_DI_TOKENS.GATEWAY_CONFIG_SERVICE,
      useExisting: GateWayConfigService,
    },
  ],
  exports: [GateWayConfigService, GATEWAY_CONFIG_DI_TOKENS.GATEWAY_CONFIG_SERVICE],
})
export class GateWayConfigModule {}
