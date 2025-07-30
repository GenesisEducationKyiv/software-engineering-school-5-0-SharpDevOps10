import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class LoggerService implements LoggerServiceInterface {
  constructor (private readonly logger: PinoLogger) {}

  setContext (context: string): void {
    this.logger.setContext(context);
  }

  debug (message: string, meta?: unknown): void {
    this.logger.debug(meta ?? {}, message);
  }

  info (message: string, meta?: unknown): void {
    this.logger.info(meta ?? {}, message);
  }

  warn (message: string, meta?: unknown): void {
    this.logger.warn(meta ?? {}, message);
  }

  error (message: string, meta?: unknown): void {
    const safeMeta = typeof meta === 'object' && meta !== null ? meta : {};
    this.logger.error(safeMeta, message);
  }
}

