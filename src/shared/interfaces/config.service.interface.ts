export interface IConfigService {
  getTokenTtlHours(): number;

  getWeatherApiKey(): string;
  getWeatherApiBaseUrl(): string;

  getVisualCrossingApiKey(): string
  getVisualCrossingBaseUrl(): string;

  getWeatherProvidersPriority(): string[];

  getRedisHost(): string;
  getRedisPort(): number;
  getRedisTtl(): number;
}
