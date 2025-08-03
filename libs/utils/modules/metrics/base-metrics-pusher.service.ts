import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { Pushgateway, RegistryContentType } from 'prom-client';

export abstract class BaseMetricsPusherService {
  protected gateway: Pushgateway<RegistryContentType>;
  protected readonly jobName: string;
  protected readonly pushInterval: number;
  protected readonly logger: LoggerServiceInterface;

  protected constructor (
    pushGatewayUrl: string,
    jobName: string,
    pushInterval: number,
    logger: LoggerServiceInterface,
  ) {
    this.gateway = new Pushgateway(pushGatewayUrl);
    this.jobName = jobName;
    this.pushInterval = pushInterval;
    this.logger = logger;
  }

  initPusher (): void {
    setInterval(() => this.pushMetrics(), this.pushInterval);
  }

  protected async pushMetrics (): Promise<void> {
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
