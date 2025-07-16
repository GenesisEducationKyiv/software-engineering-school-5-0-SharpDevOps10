import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class TokenNotFoundException extends RpcException {
  constructor () {
    super({
      code: status.NOT_FOUND,
      message: 'Token not found',
    });
  }

}
