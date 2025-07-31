import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { Pushgateway, RegistryContentType } from 'prom-client';
import { IWeatherConfigService } from '../config/interfaces/weather-config.service.interface';
import { WEATHER_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class MetricsPusherService implements OnModuleInit {
  private gateway: Pushgateway<RegistryContentType>;
  private jobName: string;

  constructor (
    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly config: IWeatherConfigService,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {}

  onModuleInit (): void {
    this.jobName = this.config.getMetricsJobName();
    this.gateway = new Pushgateway(this.config.getPushGatewayUrl());

    const interval = this.config.getMetricsPushInterval();
    setInterval(() => this.pushMetrics(), interval);
  }

  private async pushMetrics (): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
      await this.gateway.pushAdd({ jobName: this.jobName });
      this.logger.info(`[${timestamp}] Metrics pushed to Pushgateway (job: ${this.jobName})`);
    } catch (err) {
      this.logger.error(`[${timestamp}] Failed to push metrics: ${err.message}`);
    }
  }
}
