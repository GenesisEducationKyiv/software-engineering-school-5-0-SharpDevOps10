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
      comment: 'Controllers should not depend on infrastructure directly',
      severity: 'error',
      from: { path: 'src/modules/.+\\.controller\\.ts$' },
      to: { path: 'src/modules/.+(repository|client|mapper)\\.ts$' }
    },
    {
      name: 'domain-no-infra',
      comment: 'Interfaces and domain logic must not depend on infrastructure',
      severity: 'error',
      from: { path: 'src/modules/.+/interfaces/.+\\.ts$' },
      to: { path: 'src/modules/.+(repository|client|mapper)\\.ts$' }
    },
    {
      name: 'services-no-direct-infra',
      comment: 'Service classes should only depend on interfaces — not directly on repositories, clients, or mappers',
      severity: 'error',
      from: {
        path: '^src/modules/.+/.+\\.service\\.ts$',
        pathNot: '\\.service\\.interface\\.ts$'
      },
      to: {
        path: '^src/modules/.+(repository|client|mapper)\\.ts$'
      }
    },
    {
      name: 'infra-no-back-to-upper-layers',
      comment: 'repository|client|mapper should not depend on controller or service',
      severity: 'error',
      from: { path: '^src/modules/.+(repository|client|mapper)\\.ts$' },
      to:   { path: '^src/modules/.+\\.(controller|service)\\.ts$' }
    },
    {
      name: 'controllers-only-services-or-dto',
      comment: 'Controllers should import services interfaces, di-tokens, DTOs or shared, but not infrastructure',
      severity: 'error',
      from: { path: '^src/modules/.+\\.controller\\.ts$' },
      to: {
        pathNot: [
          '^src/modules/.+\\.service\\.ts$',
          '^src/modules/.+/enums/.+\\.ts$',
          '^src/shared/.+\\.ts$',
          '^src/modules/.+/di-tokens\\.ts$',
          '^src/modules/.+/presentation/.+\\.ts$',
        ]
      }
    },
    {
      name: 'no-cross-module-impl',
      comment: 'A module should not import implementation files from another module (modules and same-module access are allowed)',
      severity: 'error',
      from: {
        path: '^src/modules/([^/]+)/',
        pathNot: '\\.module\\.ts$'
      },
      to: {
        path: '^src/modules/((?!\\1)([^/])+)/.+\\.(repository|service|controller|client|mapper)\\.ts$'
      }
    },
    {
      name: 'infra-no-other-infra',
      comment: 'Each infrastructure module should be isolated from others',
      severity: 'error',
      from: {
        path: '^src/modules/([^/]+)/(repository|client|mapper|service)\\.ts$'
      },
      to: {
        path: '^src/modules/(?!\\1)([^/]+)/(repository|client|mapper|service)\\.ts$'
      }
    }
  ],
  options: {
    tsConfig: {
      fileName: "./tsconfig.json",
    },
    exclude: {
      path: "node_modules",
    },
    doNotFollow: {
      path: "node_modules",
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
    },
  },
};