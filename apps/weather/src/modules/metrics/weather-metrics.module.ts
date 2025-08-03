import { Module } from '@nestjs/common';
import { WeatherMetricsPusherService } from './weather-metrics-pusher.service';
import { WeatherConfigModule } from '../config/weather-config.module';
import { MetricsModule } from '@utils/modules/metrics/metrics.module';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  imports: [
    WeatherConfigModule,
    MetricsModule,
    LoggerModule,
  ],
  providers: [WeatherMetricsPusherService],
  exports: [MetricsModule],
})
export class WeatherMetricsModule {}
