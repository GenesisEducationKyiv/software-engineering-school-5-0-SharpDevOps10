import { emailMetrics } from '../email.metrics';
import { EmailTemplateEnum } from '@grpc-types/email-template.enum';

export function TrackEmailSendMetrics () {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const dto = args[0] as { template: EmailTemplateEnum };
      const template: EmailTemplateEnum = dto?.template ?? EmailTemplateEnum.CONFIRM;

      const timer = emailMetrics.sendDuration.startTimer({ template });

      try {
        const result = await originalMethod.apply(this, args);
        emailMetrics.sendTotal.inc({ status: 'success', template });
        
        return result;
      } catch (err) {
        emailMetrics.sendTotal.inc({ status: 'fail', template });

        if (err.message?.includes('Invalid template')) {
          emailMetrics.templateValidationFailures.inc({ template });
        }

        throw err;
      } finally {
        timer();
      }
    };

    return descriptor;
  };
}
