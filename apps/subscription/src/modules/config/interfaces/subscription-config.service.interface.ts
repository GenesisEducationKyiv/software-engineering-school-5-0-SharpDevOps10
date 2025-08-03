export interface SubscriptionConfigServiceInterface {
  getPort(): number;

  getTokenTtlHours(): number;

  getFrontendUrl(): string;

  getWeatherClientHost(): string;
  getWeatherClientPort(): number;

  getRabbitMqHost(): string;
  getRabbitMqPort(): number;

  getPushGatewayUrl(): string;
  getMetricsJobName(): string;
  getMetricsPushInterval(): number;
}
