import { Inject, Injectable } from '@nestjs/common';
import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { VisualCrossingHandler } from '@weather/handlers/visual-crossing.handler';
import { IWeatherHandler } from '../interfaces/weather-handler.interface';
import { WeatherProviderEnum } from '@weather/enums/weather.provider.enum';
import { CONFIG_DI_TOKENS } from '@config/di-tokens';
import { IConfigService } from '@config/config.service.interface';

@Injectable()
export class WeatherHandlerFactory {
  private readonly strategies: Record<WeatherProviderEnum, IWeatherHandler>;

  constructor (
    weatherApi: WeatherApiHandler,
    visualCrossing: VisualCrossingHandler,
    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly config: IConfigService,
  ) {
    this.strategies = {
      [WeatherProviderEnum.WEATHER_API]: weatherApi,
      [WeatherProviderEnum.VISUAL_CROSSING]: visualCrossing,
    };
  }

  createChain (): IWeatherHandler {
    const priority = this.config.getWeatherProvidersPriority();

    let chain: IWeatherHandler | null = null;
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
