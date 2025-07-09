import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { IWeatherApiClient } from '@weather/application/interfaces/weather-api.interface';
import { VisualCrossingResponse } from '@visual-crossing-api/responses/visual-crossing.response';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IVisualCrossingMapper } from '@visual-crossing-api/client/interfaces/visual-crossing.mapper.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { CONFIG_DI_TOKENS } from '@config/di-tokens';
import { IConfigService } from '@shared/interfaces/config.service.interface';
import { LogResponseToFile } from '@shared/decorators/log-response-to-file.decorator';

@Injectable()
export class VisualCrossingClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_MAPPER)
    private readonly mapper: IVisualCrossingMapper,
    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly config: IConfigService,
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
      throw new HttpException(
        `Cannot reach Visual Crossing API: ${err.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const bodyText = await response.text();

    if (!response.ok) this.handleApiError(response.status, bodyText, city);

    try {
      const json = JSON.parse(bodyText);

      const data = plainToInstance(VisualCrossingResponse, json);

      return this.mapper.mapToGetWeatherResponse(data);
    } catch (err) {
      throw new HttpException('Failed to parse Visual Crossing response', HttpStatus.BAD_GATEWAY);
    }
  }

  private handleApiError (status: number, body: string, city: string): never {
    const message = body || 'Unknown error from Visual Crossing API';

    if (status === 400 && /invalid location/i.test(message)) {
      throw new NotFoundException(`City not found: ${city}`);
    }

    throw new HttpException(
      `Visual Crossing API error ${status}: ${message}`,
      status,
    );
  }
}
