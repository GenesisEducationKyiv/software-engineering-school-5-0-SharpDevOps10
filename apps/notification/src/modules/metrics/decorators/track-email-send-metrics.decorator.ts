import { notificationMetrics } from '../notification.metrics';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';

export function TrackEmailSendMetrics () {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const frequency = args[0] as SubscriptionFrequencyEnum;
      const label = frequency.toLowerCase();

      const overallTimer = notificationMetrics.emailResponseTime.startTimer({ frequency: label });

      try {
        const result = await originalMethod.apply(this, args);
        notificationMetrics.emailSendAttempts.inc({ status: 'success', frequency: label });
        
        return result;
      } catch (err) {
        notificationMetrics.emailSendAttempts.inc({ status: 'fail', frequency: label });
        throw err;
      } finally {
        overallTimer();
      }
    };

    return descriptor;
  };
}
