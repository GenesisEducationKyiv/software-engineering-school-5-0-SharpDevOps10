import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class LoggerService implements LoggerServiceInterface {
  private readonly SAMPLE_RATE_INFO = 0.2;
  private readonly SAMPLE_RATE_DEBUG = 0.3;
  private readonly SAMPLE_RATE_WARN = 0.2;

  constructor (private readonly logger: PinoLogger) {}

  debug (message: string, meta?: unknown): void {
    if (Math.random() < this.SAMPLE_RATE_DEBUG) {
      this.logger.debug(meta ?? {}, message);
    }
  }

  info (message: string, meta?: unknown): void {
    if (Math.random() < this.SAMPLE_RATE_INFO) {
      this.logger.info(meta ?? {}, message);
    }
  }

  warn (message: string, meta?: unknown): void {
    if (Math.random() < this.SAMPLE_RATE_WARN) {
      this.logger.warn(meta ?? {}, message);
    }
  }

  error (message: string, meta?: unknown): void {
    const safeMeta = typeof meta === 'object' && meta !== null ? meta : {};
    this.logger.error(safeMeta, message);
  }
}

