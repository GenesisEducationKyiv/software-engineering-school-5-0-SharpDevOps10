import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { WeatherConfigServiceInterface } from '../config/interfaces/weather-config.service.interface';
import { WEATHER_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { BaseMetricsPusherService } from '@utils/modules/metrics/base-metrics-pusher.service';

@Injectable({ scope: Scope.DEFAULT })
export class WeatherMetricsPusherService extends BaseMetricsPusherService implements OnModuleInit {
  constructor (
    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
      config: WeatherConfigServiceInterface,

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
