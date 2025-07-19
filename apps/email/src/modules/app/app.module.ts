import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConfigModule } from '../config/email-config.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailConfigModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
