import { Injectable, Logger } from '@nestjs/common';
import type { ILoggerService } from '@shared/interfaces/logger.service.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger('NotificationController');

  log (message: string): void {
    this.logger.log(message);
  }

  error (message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
}
