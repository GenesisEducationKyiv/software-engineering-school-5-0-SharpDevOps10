import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import { EmailJobService } from '@notification/jobs/email-job.service';

@Injectable()
export class NotificationService {
  constructor (
    private readonly emailJobService: EmailJobService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'sendHourlyEmails',
    timeZone: 'Europe/Kyiv',
  })
  async sendHourlyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    name: 'sendDailyEmails',
    timeZone: 'Europe/Kyiv',
  })
  async sendDailyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);
  }
}
