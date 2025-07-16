import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class InvalidTokenException extends RpcException {
  constructor () {
    super({
      code: status.INVALID_ARGUMENT,
      message: 'Invalid token',
    });
  }

}
