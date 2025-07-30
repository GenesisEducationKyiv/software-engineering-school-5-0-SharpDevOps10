import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class LoggerService implements LoggerServiceInterface {
  constructor (private readonly logger: PinoLogger) {}

  setContext (context: string): void {
    this.logger.setContext(context);
  }

  info (message: string): void {
    this.logger.info(message);
  }

  error (message: string, trace?: string): void {
    this.logger.error({ trace }, message);
  }

  warn (message: string): void {
    this.logger.warn(message);
  }

  debug (message: string): void {
    this.logger.debug(message);
  }
}

