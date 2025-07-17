import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherConfigModule } from '../config/weather-config.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    WeatherConfigModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
