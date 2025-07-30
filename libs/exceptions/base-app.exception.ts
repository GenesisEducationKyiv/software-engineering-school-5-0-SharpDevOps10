export abstract class BaseAppException extends Error {
  protected constructor (public readonly message: string, public readonly type: string) {
    super(message);
  }
}
