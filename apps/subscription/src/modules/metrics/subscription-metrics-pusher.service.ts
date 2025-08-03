import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { Pushgateway, RegistryContentType } from 'prom-client';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../config/di-tokens';
import { SubscriptionConfigServiceInterface } from '../config/interfaces/subscription-config.service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class SubscriptionMetricsPusherService implements OnModuleInit {
  private gateway: Pushgateway<RegistryContentType>;
  private jobName: string;

  constructor (
    @Inject(SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE)
    private readonly config: SubscriptionConfigServiceInterface,

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
    try {
      await this.gateway.pushAdd({ jobName: this.jobName });
      this.logger.info(`Metrics pushed to Pushgateway (job: ${this.jobName})`, {
        context: this.constructor.name,
        method: this.pushMetrics.name,
      });
    } catch (err) {
      this.logger.error(`Failed to push metrics: ${err.message}`, {
        context: this.constructor.name,
        method: this.pushMetrics.name,
        error: err,
      });
    }
  }
}
