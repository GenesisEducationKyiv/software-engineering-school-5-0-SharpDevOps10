import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IWeatherApiClient } from '../../weather/application/interfaces/weather-api.interface';
import { WEATHER_DI_TOKENS } from '../../weather/constants/di-tokens';
import { IVisualCrossingMapper } from './interfaces/visual-crossing.mapper.interface';
import { WEATHER_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { IWeatherConfigService } from '../../config/interfaces/weather-config.service.interface';
import { LogResponseToFile } from '@utils/decorators/log-response-to-file.decorator';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';
import { VisualCrossingResponse } from '../responses/visual-crossing.response';
import {
  InternalRpcException,
  NotFoundRpcException,
  UnavailableException,
} from '@exceptions/grpc-exceptions';

@Injectable()
export class VisualCrossingClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_MAPPER)
    private readonly mapper: IVisualCrossingMapper,
    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly config: IWeatherConfigService,
  ) {}

  @LogResponseToFile('visualcrossing.com')
  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const baseUrl = this.config.getVisualCrossingBaseUrl();
    const apiKey = this.config.getVisualCrossingApiKey();

    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&include=current&key=${apiKey}&contentType=json`;

    let response: Response;

    try {
      response = await fetch(url);
    } catch (err) {
      throw new UnavailableException(`Cannot reach Visual Crossing API: ${err.message}`);
    }

    const bodyText = await response.text();

    if (!response.ok) this.handleApiError(response.status, bodyText, city);

    try {
      const json = JSON.parse(bodyText);

      const data = plainToInstance(VisualCrossingResponse, json);

      return this.mapper.mapToGetWeatherResponse(data);
    } catch (err) {
      throw new InternalRpcException('Failed to parse Visual Crossing response');
    }
  }

  private handleApiError (status: number, body: string, city: string): never {
    const message = body || 'Unknown error from Visual Crossing API';

    if (status === 400 && /invalid location/i.test(message)) {
      throw new NotFoundRpcException(`City not found: ${city}`);
    }

    throw new InternalRpcException(`Visual Crossing API error ${status}: ${message}`);
  }
}
