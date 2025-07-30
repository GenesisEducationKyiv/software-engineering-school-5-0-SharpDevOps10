export interface ISubscriptionConfigService {
  getPort(): number;

  getTokenTtlHours(): number;

  getFrontendUrl(): string;

  getWeatherClientHost(): string;
  getWeatherClientPort(): number;

  getRabbitMqHost(): string;
  getRabbitMqPort(): number;
}
