import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { ServiceError, status as GrpcStatus } from '@grpc/grpc-js';
import { Response } from 'express';

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly grpcToHttpMap: Record<number, HttpStatus> = {
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  catch (exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (this.isGrpcServiceError(exception)) {
      const { code, message } = exception as ServiceError;
      const httpStatus = this.mapGrpcToHttp(code);

      Logger.error(
        `gRPC Error (${code}): ${message}`,
        RpcToHttpExceptionFilter.name,
      );

      response.status(httpStatus).json({
        message: this.extractGrpcMessage(message),
      });
    } else {
      Logger.error(exception.stack, undefined, RpcToHttpExceptionFilter.name);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  private isGrpcServiceError (error: unknown): error is ServiceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      error instanceof Error &&
      typeof (error as Partial<ServiceError>).code === 'number'
    );
  }

  private mapGrpcToHttp (code: number): HttpStatus {
    return this.grpcToHttpMap[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private extractGrpcMessage (raw: string): string {
    const index = raw.indexOf(':');
    
    return index === -1 ? raw : raw.slice(index + 1).trim();
  }
}
