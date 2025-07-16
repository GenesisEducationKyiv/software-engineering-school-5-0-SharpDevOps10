export interface ISubscriptionConfigService {
  getPort(): number;

  getTokenTtlHours(): number;

  getFrontendUrl(): string;

  getEmailClientHost(): string;
  getEmailClientPort(): number;
}
