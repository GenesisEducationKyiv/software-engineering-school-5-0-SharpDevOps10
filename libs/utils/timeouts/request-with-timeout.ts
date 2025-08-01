import { Observable, throwError, firstValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

export const requestWithTimeout = async <T> (
  observable: Observable<T>,
  logger: LoggerServiceInterface,
  timeoutMs = 3000,
  logContext: string,
): Promise<T> => firstValueFrom(
  observable.pipe(
    timeout(timeoutMs),
    catchError((err) => {
      logger.error(`Timeout or error in ${ logContext }`, {
        error: err?.message,
        stack: err?.stack,
        context: logContext,
      });

      return throwError(() => err);
    }),
  )
);
