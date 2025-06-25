import { Injectable } from '@nestjs/common';
import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { VisualCrossingHandler } from '@weather/handlers/visual-crossing.handler';
import { IWeatherHandler } from '../interfaces/weather-handler.interface';

@Injectable()
export class WeatherHandlerFactory {
  create (weatherApi: WeatherApiHandler, visualCrossing: VisualCrossingHandler): IWeatherHandler {
    weatherApi.setNext(visualCrossing);
    
    return weatherApi;
  }
}
