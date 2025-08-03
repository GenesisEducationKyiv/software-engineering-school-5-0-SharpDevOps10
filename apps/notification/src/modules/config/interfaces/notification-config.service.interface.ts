export interface NotificationConfigServiceInterface {
  getPort(): number;

  getWeatherClientHost(): string;
  getWeatherClientPort(): number;

  getSubscriptionClientHost(): string;
  getSubscriptionClientPort(): number;

  getRabbitMqHost(): string;
  getRabbitMqPort(): number;

  getSubscriptionProducerTimeout(): number;

  getPushGatewayUrl(): string;
  getMetricsJobName(): string;
  getMetricsPushInterval(): number;
}
