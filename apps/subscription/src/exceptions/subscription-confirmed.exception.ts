import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class SubscriptionConfirmedException extends RpcException {
  constructor () {
    super({
      code: status.ALREADY_EXISTS,
      message: 'Subscription already confirmed',
    });
  }
}
