import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class SubscriptionNotConfirmedException extends RpcException {
  constructor () {
    super({
      code: status.ALREADY_EXISTS,
      message: 'Subscription not confirmed',
    });
  }

}