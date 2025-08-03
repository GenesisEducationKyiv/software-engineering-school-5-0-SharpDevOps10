import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GateWayConfigModule } from './modules/config/gate-way-config.module';
import { WeatherModule } from './modules/weather/weather.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpLoggingMiddleware } from './middlewares/http-logging.middleware';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  imports: [
    GateWayConfigModule,
    WeatherModule,
    SubscriptionModule,
    LoggerModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'gateway', 'public'),
    }),
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(HttpLoggingMiddleware)
      .forRoutes('*');
  }
}

