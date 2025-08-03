import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor (
    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {}

  use (req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = req;

    this.logger.info(`Incoming HTTP request: ${method} ${originalUrl}`, {
      context: 'HttpGateway',
      method,
      query,
      body,
    });

    next();
  }
}
