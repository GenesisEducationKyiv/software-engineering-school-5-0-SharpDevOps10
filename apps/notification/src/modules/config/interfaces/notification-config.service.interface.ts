export interface INotificationConfigService {
  getPort(): number;

  getWeatherClientHost(): string;
  getWeatherClientPort(): number;

  getSubscriptionClientHost(): string;
  getSubscriptionClientPort(): number;

  getEmailClientHost(): string;
  getEmailClientPort(): number;
}
