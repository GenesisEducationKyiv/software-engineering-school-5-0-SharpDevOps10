import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IWeatherApiClient } from '../../weather/application/interfaces/weather-api.interface';
import { WEATHER_DI_TOKENS } from '../../weather/constants/di-tokens';
import { IVisualCrossingMapper } from './interfaces/visual-crossing.mapper.interface';
import { WEATHER_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { IWeatherConfigService } from '../../config/interfaces/weather-config.service.interface';
import { LogResponseToFile } from '@utils/decorators/log-response-to-file.decorator';
import { VisualCrossingResponse } from '../responses/visual-crossing.response';
import {
  InternalRpcException,
  NotFoundRpcException,
  UnavailableException,
} from '@exceptions/grpc-exceptions';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class VisualCrossingClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_MAPPER)
    private readonly mapper: IVisualCrossingMapper,

    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly config: IWeatherConfigService,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
    this.logger.setContext(VisualCrossingClient.name);
  }

  @LogResponseToFile('visualcrossing.com')
  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const baseUrl = this.config.getVisualCrossingBaseUrl();
    const apiKey = this.config.getVisualCrossingApiKey();

    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&include=current&key=${apiKey}&contentType=json`;

    let response: Response;

    try {
      response = await fetch(url);
    } catch (err) {
      this.logger.error(`Network error while fetching weather from Visual Crossing for ${city}: ${err.message}`);
      throw new UnavailableException(`Cannot reach Visual Crossing API: ${err.message}`);
    }

    const bodyText = await response.text();

    if (!response.ok) {
      this.logger.warn(`Visual Crossing API responded with status ${response.status} for ${city}`, { body: bodyText });
      this.handleApiError(response.status, bodyText, city);
    }

    try {
      const json = JSON.parse(bodyText);

      const data = plainToInstance(VisualCrossingResponse, json);

      return this.mapper.mapToGetWeatherResponse(data);
    } catch (err) {
      this.logger.error(`Failed to parse response from Visual Crossing for ${city}`, { body: bodyText });
      throw new InternalRpcException('Failed to parse Visual Crossing response');
    }
  }

  private handleApiError (status: number, body: string, city: string): never {
    const message = body || 'Unknown error from Visual Crossing API';

    if (status === 400 && /invalid location/i.test(message)) {
      this.logger.warn(`Invalid city provided to Visual Crossing: ${city}`);
      throw new NotFoundRpcException(`City not found: ${city}`);
    }

    this.logger.error(`Visual Crossing API error ${status} for ${city}`, { body });
    throw new InternalRpcException(`Visual Crossing API error ${status}: ${message}`);
  }
}
