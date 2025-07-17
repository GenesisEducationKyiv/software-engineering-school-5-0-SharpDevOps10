export interface IWeatherConfigService {
  getPort(): number;

  getWeatherApiKey(): string;
  getWeatherApiBaseUrl(): string;

  getVisualCrossingApiKey(): string
  getVisualCrossingBaseUrl(): string;

  getWeatherProvidersPriority(): string[];

  getRedisTtl(): number;
}
