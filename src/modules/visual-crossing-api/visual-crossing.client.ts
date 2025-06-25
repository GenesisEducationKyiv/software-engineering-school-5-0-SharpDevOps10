import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { VisualCrossingResponse } from '@modules/visual-crossing-api/responses/visual-crossing.response';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IVisualCrossingMapper } from '@visual-crossing-api/interfaces/visual-crossing.mapper.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';
import { IConfigService } from '@modules/config/config.service.interface';

@Injectable()
export class VisualCrossingClient implements IWeatherApiClient {

  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_MAPPER)
    private readonly mapper: IVisualCrossingMapper,
    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly config: IConfigService,
  ) {}

  private readonly apiKey = this.config.getWeatherApiKey();
  private readonly baseUrl = this.config.getVisualCrossingBaseUrl();

  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const url = `${this.baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&include=current&key=${this.apiKey}&contentType=json`;

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
