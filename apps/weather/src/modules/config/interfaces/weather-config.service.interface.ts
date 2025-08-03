export interface WeatherConfigServiceInterface {
  getPort(): number;

  getWeatherApiKey(): string;
  getWeatherApiBaseUrl(): string;

  getVisualCrossingApiKey(): string
  getVisualCrossingBaseUrl(): string;

  getWeatherProvidersPriority(): string[];

  getRedisTtl(): number;

  getPushGatewayUrl(): string;
  getMetricsJobName(): string;

  getMetricsPushInterval(): number;
}
