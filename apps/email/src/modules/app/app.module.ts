import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConfigModule } from '../config/email-config.module';
import { EmailModule } from '../email/email.module';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  imports: [
    EmailConfigModule,
    EmailModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
