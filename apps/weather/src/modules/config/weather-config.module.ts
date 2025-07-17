import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { weatherValidationSchema } from './weather-validation.schema';
import { WeatherConfigService } from './weather-config.service';
import { WEATHER_CONFIG_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['apps/weather/.env'],
      validationSchema: weatherValidationSchema,
    }),
  ],
  providers: [
    WeatherConfigService,
    {
      provide: WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE,
      useExisting: WeatherConfigService,
    },
  ],
  exports: [WeatherConfigService, WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE],
})
export class WeatherConfigModule {}
