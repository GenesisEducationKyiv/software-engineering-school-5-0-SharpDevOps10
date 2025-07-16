import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class EmailSubscribedException extends RpcException {
  constructor () {
    super({
      code: status.ALREADY_EXISTS,
      message: 'Email already subscribed for this city',
    });
  }
  
}
