import { Module } from '@nestjs/common';
import { GateWayConfigModule } from './modules/config/gate-way-config.module';
import { WeatherModule } from './modules/weather/weather.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    GateWayConfigModule,
    WeatherModule,
    SubscriptionModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'gateway', 'public'),
    }),
  ],
  providers: [],
})
export class AppModule {}
