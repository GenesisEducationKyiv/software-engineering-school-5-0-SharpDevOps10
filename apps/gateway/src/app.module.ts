import { Module } from '@nestjs/common';
import { GateWayConfigModule } from './modules/config/gate-way-config.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    GateWayConfigModule,
    WeatherModule,
  ],
  providers: [],
})
export class AppModule {}
