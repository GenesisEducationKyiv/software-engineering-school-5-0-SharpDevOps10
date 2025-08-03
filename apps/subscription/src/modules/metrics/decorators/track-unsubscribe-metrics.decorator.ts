import { subscriptionMetrics } from '../subscription.metrics';

export function TrackUnsubscribeMetrics () {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      try {
        const result = await originalMethod.apply(this, args);

        subscriptionMetrics.deleted.inc();

        const repo = this.subscriptionRepository;
        const countConfirmed = await repo.countConfirmed();
        subscriptionMetrics.count.set({ confirmed: 'true' }, countConfirmed);

        return result;
      } catch (error) {
        if (error?.message?.toLowerCase().includes('token')) {
          subscriptionMetrics.invalidToken.inc();
        }
        throw error;
      }
    };

    return descriptor;
  };
}
