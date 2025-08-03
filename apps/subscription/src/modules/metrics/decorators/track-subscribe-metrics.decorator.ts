import { subscriptionMetrics } from '../subscription.metrics';

export function TrackSubscribeMetrics () {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const end = subscriptionMetrics.processingDuration.startTimer();
      try {
        const result = await originalMethod.apply(this, args);

        subscriptionMetrics.created.inc({ status: 'success' });

        const repo = this.subscriptionRepository;
        const countConfirmed = await repo.countConfirmed();
        const countUnconfirmed = await repo.countUnconfirmed();

        subscriptionMetrics.count.set({ confirmed: 'true' }, countConfirmed);
        subscriptionMetrics.count.set({ confirmed: 'false' }, countUnconfirmed);

        return result;
      } catch (error) {
        subscriptionMetrics.created.inc({ status: 'fail' });

        if (
          error?.message?.toLowerCase().includes('token') ||
          error?.message?.toLowerCase().includes('invalid city')
        ) {
          subscriptionMetrics.cityValidationFail.inc();
        }

        throw error;
      } finally {
        end();
      }
    };

    return descriptor;
  };
}
