import { SubscriptionFrequencyEnum } from '@grpc-types//subscription-frequency.enum';
import { notificationMetrics } from '../notification.metrics';

export function TrackSubscriptionFetchMetrics () {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const frequency = args[0] as SubscriptionFrequencyEnum;
      const label = frequency.toLowerCase();
      const end = notificationMetrics.fetchResponseTime.startTimer({ frequency: label });

      try {
        const result = await originalMethod.apply(this, args);
        notificationMetrics.subscriptionFetchAttempts.inc({ status: 'success', frequency: label });
        
        return result;
      } catch (err) {
        notificationMetrics.subscriptionFetchAttempts.inc({ status: 'fail', frequency: label });
        throw err;
      } finally {
        end();
      }
    };

    return descriptor;
  };
}
