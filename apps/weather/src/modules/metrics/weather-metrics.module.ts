import { Module } from '@nestjs/common';
import { MetricsPusherService } from './weather-metrics-pusher.service';
import { WeatherConfigModule } from '../config/weather-config.module';
import { MetricsModule } from '@utils/modules/metrics/metrics.module';

@Module({
  imports: [
    WeatherConfigModule,
    MetricsModule,
  ],
  providers: [MetricsPusherService],
  exports: [MetricsModule],
})
export class WeatherMetricsModule {}
