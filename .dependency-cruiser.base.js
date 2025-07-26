module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Prevent circular dependencies',
      severity: 'error',
      from: {},
      to: { circular: true }
    },
    {
      name: 'controllers-no-infra',
      comment: 'Controllers must not directly depend on infrastructure (config, services)',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+\\.controller\\.ts$' },
      to: { path: '^src/modules/[^/]+/.+(config\\.service|service)\\.ts$' }
    },
    {
      name: 'services-no-direct-infra',
      comment: 'Service must use interfaces, not concrete infrastructure',
      severity: 'error',
      from: {
        path: '^src/modules/[^/]+/.+\\.service\\.ts$',
        pathNot: '\\.interface\\.ts$'
      },
      to: {
        path: '^src/modules/[^/]+/.+config\\.service\\.ts$'
      }
    },
    {
      name: 'infra-no-back-dependencies',
      comment: 'Infrastructure must not depend on controller or service',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+config\\.service\\.ts$' },
      to: { path: '^src/modules/[^/]+/.+\\.(controller|service)\\.ts$' }
    },
    {
      name: 'controller-only-allowed-imports',
      comment: 'Controller can only import service interfaces, DTOs, constants, etc.',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+\\.controller\\.ts$' },
      to: {
        pathNot: [
          '^src/modules/[^/]+/interfaces/.+\\.ts$',
          '^src/modules/[^/]+/constants/.+\\.ts$',
          '^src/modules/[^/]+/dto/.+\\.ts$',
          '^src/modules/[^/]+/enums/.+\\.ts$',
        ]
      }
    },
    {
      name: 'no-cross-module-impl',
      comment: 'No imports from implementation files of other modules',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)/' },
      to: {
        path: '^src/modules/(?!\\1)[^/]+/.+\\.(service|repository|client|mapper|config)\\.ts$'
      }
    },
    {
      name: 'services-no-grpc-generated',
      comment: 'Services should not import gRPC generated code directly',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/.+\\.service\\.ts$' },
      to: { path: '^src/generated/.+\\.ts$' }
    }
  ],
  options: {
    tsConfig: {
      fileName: './tsconfig.json'
    },
    exclude: {
      path: 'node_modules'
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
};
