import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { BaseMetricsPusherService } from '@utils/modules/metrics/base-metrics-pusher.service';
import { EMAIL_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { EmailConfigServiceInterface } from '../config/interfaces/email-config.service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class EmailMetricsPusherService extends BaseMetricsPusherService implements OnModuleInit {
  constructor (
    @Inject(EMAIL_CONFIG_DI_TOKENS.EMAIL_CONFIG_SERVICE)
      config: EmailConfigServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
      logger: LoggerServiceInterface,
  ) {
    super(
      config.getPushGatewayUrl(),
      config.getMetricsJobName(),
      config.getMetricsPushInterval(),
      logger,
    );
  }

  onModuleInit (): void {
    this.initPusher();
  }
}
