import { Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch (exception: unknown): Observable<unknown> {
    if (exception instanceof RpcException) {
      const error = exception.getError();

      this.logger.warn(`RpcException: ${error}`);
      
      return throwError(() => error);
    }

    this.logger.error(
      'Unhandled exception in gRPC handler',
      (exception as Error)?.stack ?? ''
    );

    return throwError(() => ({
      code: status.INTERNAL,
      message: 'Internal server error',
    }));
  }
}
