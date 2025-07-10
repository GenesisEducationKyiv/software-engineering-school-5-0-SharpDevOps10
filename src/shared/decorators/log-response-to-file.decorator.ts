import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { cwd } from 'node:process';

export function LogResponseToFile (providerName: string): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): void => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const logPath = path.join(cwd(), 'logs', 'provider.log');
      await fs.mkdir(path.dirname(logPath), { recursive: true });

      try {
        const result = await originalMethod.apply(this, args);

        const logEntry = `${new Date().toISOString()} - ${providerName} - Response: ${JSON.stringify(result)}\n`;
        await fs.appendFile(logPath, logEntry);

        return result;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : JSON.stringify(error);

        const logEntry = `${new Date().toISOString()} - ${providerName} - Error: ${message}\n`;
        await fs.appendFile(logPath, logEntry);

        throw error;
      }
    };
  };
}
