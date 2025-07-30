export interface LoggerServiceInterface {
  setContext (context: string): void;
  info (message: string): void;
  error (message: string, trace?: string): void;
  warn (message: string): void;
  debug (message: string): void;
}
