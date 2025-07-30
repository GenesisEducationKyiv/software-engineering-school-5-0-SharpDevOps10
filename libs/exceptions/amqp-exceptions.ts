import { BaseAppException } from './base-app.exception';

export class EmailInvalidArgumentException extends BaseAppException {
  constructor (message: string) {
    super(message, 'INVALID_ARGUMENT');
  }
}
