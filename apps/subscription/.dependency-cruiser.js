const base = require('../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'no-direct-weather-client',
      comment: 'Only infrastructure layer can use WeatherClientService',
      severity: 'error',
      from: {
        path: '^src/modules/subscription/(?!infrastructure/).+\\.ts$'
      },
      to: {
        path: '^src/modules/subscription/infrastructure/weather-client\\.service\\.ts$'
      }
    },
    {
      name: 'email-sender-no-controller',
      comment: 'SubscriptionEmailSender must not be used in controller — only in service layer',
      severity: 'error',
      from: { path: '^src/modules/subscription/.+\\.controller\\.ts$' },
      to: { path: '^src/modules/subscription/infrastructure/subscription-email-sender\\.ts$' }
    },
    {
      name: 'email-client-direct-import',
      comment: 'EmailClientService should only be used via IEmailClient interface',
      severity: 'error',
      from: { path: '^src/modules/subscription/' },
      to: {
        path: '^src/modules/subscription/infrastructure/email-client\\.service\\.ts$'
      }
    }

  ]
};