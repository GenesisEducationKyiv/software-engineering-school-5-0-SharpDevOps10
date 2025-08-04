import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from './di-tokens';
import { LoggerConfigServiceInterface } from '@utils/modules/logger/configs/logger-config-service.interface';

@Injectable()
export class LoggerService implements LoggerServiceInterface {
  constructor (
    private readonly logger: PinoLogger,

    @Inject(LOGGER_DI_TOKENS.LOGGER_CONFIG_SERVICE)
    private readonly config: LoggerConfigServiceInterface,
  ) {}

  debug (message: string, meta?: unknown): void {
    if (Math.random() < this.config.sampleRateDebug) {
      this.logger.debug(meta ?? {}, message);
    }
  }

  info (message: string, meta?: unknown): void {
    if (Math.random() < this.config.sampleRateInfo) {
      this.logger.info(meta ?? {}, message);
    }
  }

  warn (message: string, meta?: unknown): void {
    if (Math.random() < this.config.sampleRateWarn) {
      this.logger.warn(meta ?? {}, message);
    }
  }

  error (message: string, meta?: unknown): void {
    const safeMeta = typeof meta === 'object' && meta !== null ? meta : {};
    this.logger.error(safeMeta, message);
  }
}

