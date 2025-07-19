import { Injectable, Logger, Scope } from '@nestjs/common';
import { ILoggerService } from '@utils/modules/logger/logger.service.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerService {
  private logger: Logger;

  setContext (context: string): void {
    this.logger = new Logger(context);
  }

  log (message: string): void {
    this.logger?.log?.(message);
  }

  error (message: string, trace?: string): void {
    this.logger?.error?.(message, trace);
  }
}

