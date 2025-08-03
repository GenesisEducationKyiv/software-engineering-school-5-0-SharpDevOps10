export interface EmailConfigServiceInterface {
  getSmtpHost(): string;
  getSmtpPort(): number;
  getSmtpUser(): string;
  getSmtpPass(): string;
  getMailFrom(): string;

  getRabbitMqHost(): string;
  getRabbitMqPort(): number;

  getPushGatewayUrl(): string;
  getMetricsJobName(): string;
  getMetricsPushInterval(): number;
}
