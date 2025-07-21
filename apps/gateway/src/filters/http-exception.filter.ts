import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException, Logger,
} from '@nestjs/common';
import { Response } from 'express';

export type ExceptionResponse = {
  message: string | string[];
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let { message } = exception.getResponse() as ExceptionResponse;
    if (Array.isArray(message)) {
      message = message[0];
    }

    Logger.warn(
      `HTTP Exception: ${status} - ${message}`,
    );

    response.status(status).send({ message });
  }
}
