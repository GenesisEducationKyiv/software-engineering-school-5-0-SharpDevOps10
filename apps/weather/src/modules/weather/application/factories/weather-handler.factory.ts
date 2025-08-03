import { Inject, Injectable } from '@nestjs/common';
import { WeatherHandlerInterface } from '../handlers/interfaces/weather-handler.interface';
import { WeatherProviderEnum } from '../../enums/weather.provider.enum';
import { WeatherApiHandler } from '../handlers/weather-api.handler';
import { VisualCrossingHandler } from '../handlers/visual-crossing.handler';
import { WEATHER_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { WeatherConfigServiceInterface } from '../../../config/interfaces/weather-config.service.interface';

@Injectable()
export class WeatherHandlerFactory {
  private readonly strategies: Record<WeatherProviderEnum, WeatherHandlerInterface>;

  constructor (
    weatherApi: WeatherApiHandler,
    visualCrossing: VisualCrossingHandler,

    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly config: WeatherConfigServiceInterface,
  ) {
    this.strategies = {
      [WeatherProviderEnum.WEATHER_API]: weatherApi,
      [WeatherProviderEnum.VISUAL_CROSSING]: visualCrossing,
    };
  }

  createChain (): WeatherHandlerInterface {
    const priority = this.config.getWeatherProvidersPriority();

    let chain: WeatherHandlerInterface | null = null;
    for (const name of priority.reverse()) {
      const handler = this.strategies[name];
      if (!handler) throw new Error(`Unknown provider: ${name}`);

      if (chain) handler.setNext(chain);
      chain = handler;
    }

    if (!chain) throw new Error('No weather providers configured');
    
    return chain;
  }
}
