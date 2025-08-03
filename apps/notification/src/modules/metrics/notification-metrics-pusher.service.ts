import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { BaseMetricsPusherService } from '@utils/modules/metrics/base-metrics-pusher.service';
import { NOTIFICATION_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { NotificationConfigServiceInterface } from '../config/interfaces/notification-config.service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class NotificationMetricsPusherService extends BaseMetricsPusherService implements OnModuleInit {
  constructor (
    @Inject(NOTIFICATION_CONFIG_DI_TOKENS.NOTIFICATION_CONFIG_SERVICE)
      config: NotificationConfigServiceInterface,

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
