export interface IWeatherClient {
  isCityValid(city: string): Promise<boolean>;
}
