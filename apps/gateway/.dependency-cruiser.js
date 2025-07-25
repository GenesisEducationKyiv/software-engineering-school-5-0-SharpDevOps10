const base = require('../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'controller-no-direct-client',
      comment: 'Controller must depend only on services, not gRPC clients directly',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+\\.controller\\.ts$' },
      to: { path: '^src/modules/clients/.+\\.ts$' }
    },
    {
      name: 'services-no-generated-grpc',
      comment: 'Services must use client interfaces, not generated gRPC directly',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+\\.service\\.ts$' },
      to: { path: '^src/generated/.+\\.ts$' }
    },
    {
      name: 'clients-no-back-imports',
      comment: 'Clients must not depend on application or presentation layers',
      severity: 'error',
      from: { path: '^src/modules/clients/.+\\.ts$' },
      to: {
        path: '^src/modules/(?!clients/)(application|.+\\.controller)\\.ts$'
      }
    },
    {
      name: 'clients-use-shared-grpc-only',
      comment: 'Clients can only depend on generated gRPC types and shared-types',
      severity: 'error',
      from: { path: '^src/modules/clients/.+\\.ts$' },
      to: {
        pathNot: [
          '^src/generated/.+\\.ts$',
          '^src/modules/clients/.+\\.ts$'
        ]
      }
    },
    {
      name: 'client-implements-interface',
      comment: 'Client must implement only explicitly defined interfaces',
      severity: 'error',
      from: { path: '^src/modules/clients/.+\\.ts$' },
      to: { path: '^src/modules/clients/interfaces/.+\\.ts$' }
    }
  ]
};
