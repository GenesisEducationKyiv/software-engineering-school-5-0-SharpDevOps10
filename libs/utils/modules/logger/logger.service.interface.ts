export interface ILoggerService {
  setContext (context: string): void;
  log (message: string): void;
  error (message: string, trace?: string): void;
}
