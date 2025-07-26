const base = require('../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'no-controller-depends-on-client',
      comment: 'NotificationController must not depend directly on email/redis/clients',
      severity: 'error',
      from: { path: '^src/modules/notification/notification\\.controller\\.ts$' },
      to: {
        path: [
          '^src/modules/notification/clients/.+\\.ts$',
          '^src/utils/.+\\.ts$',
        ]
      }
    },
    {
      name: 'job-service-only-use-interfaces',
      comment: 'EmailJobService should use interfaces, not concrete implementations',
      severity: 'error',
      from: {
        path: '^src/modules/notification/application/services/email-job\\.service\\.ts$',
        pathNot: '\\.interface\\.ts$'
      },
      to: {
        path: '^src/modules/notification/(?!application)/.+\\.ts$',
        pathNot: '\\.interface\\.ts$'
      }
    },
    {
      name: 'email-sender-no-job-dependency',
      comment: 'Email sender must not depend on job service',
      severity: 'error',
      from: { path: '^src/modules/notification/application/services/notification-email-sender\\.service\\.ts$' },
      to: { path: '^src/modules/notification/application/services/email-job\\.service\\.ts$' }
    },
    {
      name: 'clients-no-back-imports',
      comment: 'Clients should not import from application or controller layer',
      severity: 'error',
      from: { path: '^src/modules/notification/clients/.+\\.ts$' },
      to: { path: '^src/modules/notification/(application|presentation)/.+\\.ts$' }
    },
    {
      name: 'email-service-no-grpc-generated-imports',
      comment: 'EmailJobService must not import gRPC-generated code directly',
      severity: 'error',
      from: { path: '^src/modules/notification/application/services/email-job\\.service\\.ts$' },
      to: { path: '^src/generated/.+\\.ts$' }
    }
  ]
};
