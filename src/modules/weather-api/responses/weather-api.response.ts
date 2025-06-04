import { Type } from 'class-transformer';
import { WeatherApiLocation } from './weather-api.location';
import { WeatherApiCurrent } from './weather-api.current';

export class WeatherApiResponse {
  @Type(() => WeatherApiLocation)
    location!: WeatherApiLocation;

  @Type(() => WeatherApiCurrent)
    current!: WeatherApiCurrent;
}
