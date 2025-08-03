import { emailMetrics } from '../email.metrics';

export function TrackEmailEventMetrics () {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      try {
        return await originalMethod.apply(this, args);
      } finally {
        emailMetrics.eventsProcessed.inc();
      }
    };

    return descriptor;
  };
}
