const base = require('../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'weather-client-no-controller-import',
      comment: 'Weather API clients must not import controllers',
      severity: 'error',
      from: { path: '^src/modules/weather/.+-client\\.ts$' },
      to: { path: '^src/modules/weather/.+\\.controller\\.ts$' }
    },
    {
      name: 'weather-client-no-handler-dependency',
      comment: 'Weather API clients must not depend on handler layer',
      severity: 'error',
      from: { path: '^src/modules/weather/.+-client\\.ts$' },
      to: { path: '^src/modules/weather/handlers/.+\\.ts$' }
    },
    {
      name: 'handlers-only-use-api-clients',
      comment: 'Handlers should depend only on weather API clients',
      severity: 'error',
      from: { path: '^src/modules/weather/handlers/.+\\.ts$' },
      to: {
        pathNot: [
          '^src/modules/weather/.+-client\\.ts$',
          '^src/modules/weather/handlers/.+\\.ts$',
          '^src/shared/.+\\.ts$',
        ]
      }
    },
    {
      name: 'cached-service-only-depends-on-redis-and-service',
      comment: 'CachedWeatherService must only depend on redis and base weather service',
      severity: 'error',
      from: { path: '^src/modules/weather/application/services/cached-weather\\.service\\.ts$' },
      to: {
        pathNot: [
          '^src/utils/modules/redis/.+\\.ts$',
          '^src/modules/weather/application/services/.+\\.ts$',
          '^src/modules/weather/config/.+\\.ts$',
        ]
      }
    },
    {
      name: 'weather-client-no-fetch-outside',
      comment: 'Only weather API clients may use fetch',
      severity: 'error',
      from: { path: '^src/modules/weather/(?!.+-client\\.ts$).+\\.ts$' },
      to: { path: 'node-fetch' }
    }
  ]
};