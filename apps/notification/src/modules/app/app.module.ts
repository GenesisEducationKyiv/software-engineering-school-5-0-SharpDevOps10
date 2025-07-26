import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationConfigModule } from '../config/notification-config.module';
import { NotificationModule } from '../notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    NotificationConfigModule,
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
