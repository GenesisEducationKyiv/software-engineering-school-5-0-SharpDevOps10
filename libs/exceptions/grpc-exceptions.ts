import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class AlreadyExistsException extends RpcException {
  constructor (message: string) {
    super({ code: status.ALREADY_EXISTS, message });
  }
}

export class InvalidArgumentException extends RpcException {
  constructor (message: string) {
    super({ code: status.INVALID_ARGUMENT, message });
  }
}

export class NotFoundRpcException extends RpcException {
  constructor (message: string) {
    super({ code: status.NOT_FOUND, message });
  }
}

export class UnavailableException extends RpcException {
  constructor (message: string) {
    super({ code: status.UNAVAILABLE, message });
  }
}

export class InternalRpcException extends RpcException {
  constructor (message: string) {
    super({ code: status.INTERNAL, message });
  }
}
