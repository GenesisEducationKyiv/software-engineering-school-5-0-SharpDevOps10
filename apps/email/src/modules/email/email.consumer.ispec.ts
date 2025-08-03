import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EmailModule } from './email.module';
import { ConfigModule } from '@nestjs/config';
import { EMAIL_EVENT_PATTERNS } from '@utils/constants/brokers/email-event.patterns';
import { SendEmailDto } from '@amqp-types/send-email.dto';
import { EmailServiceInterface } from './interfaces/email.service.interface';
import { EmailTemplateEnum } from '@grpc-types/email-template.enum';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { scheduler } from 'node:timers/promises';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@utils/constants/brokers/queues';
import { EmailMetricsPusherService } from '../metrics/email-metrics-pusher.service';

describe('EmailConsumer (integration)', () => {
  let app: INestApplication;
  let channelModel: amqp.ChannelModel;
  let channel: amqp.Channel;

  const sendEmailMock = jest.fn();
  const emailServiceMock: EmailServiceInterface = {
    sendEmail: sendEmailMock,
  };

  const emailMetricsPusherMock = {
    initPusher: jest.fn(),
    onModuleDestroy: jest.fn(),
  };

  let publish: (pattern: string, data: object) => void;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'apps/email/.env.test',
        }),
        EmailModule,
      ],
    })
      .overrideProvider(EMAIL_DI_TOKENS.EMAIL_SERVICE)
      .useValue(emailServiceMock)
      .overrideProvider(EmailMetricsPusherService)
      .useValue(emailMetricsPusherMock)
      .compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: QUEUES.EMAIL_QUEUE,
        queueOptions: {
          durable: false,
        },
        noAck: false,
      },
    });

    await app.startAllMicroservices();
    await scheduler.wait(300);
    await app.init();

    channelModel = await amqp.connect('amqp://localhost:5672');
    channel = await channelModel.createChannel();
    await channel.assertQueue(QUEUES.EMAIL_QUEUE, { durable: false });
    await channel.bindQueue(QUEUES.EMAIL_QUEUE, 'amq.topic', EMAIL_EVENT_PATTERNS.SEND_EMAIL);

    publish = (pattern: string, data: object): void => {
      channel.publish(
        'amq.topic',
        pattern,
        Buffer.from(JSON.stringify({
          pattern,
          data,
        })),
        {
          contentType: 'application/json',
        },
      );
    };

  });

  afterAll(async () => {
    await channel.close();
    await channelModel.close();
    await app.close();
  });

  beforeEach(async () => {
    await channel.purgeQueue(QUEUES.EMAIL_QUEUE);
    jest.clearAllMocks();
  });

  it('should consume message and call sendEmail', async () => {
    const dto: SendEmailDto = {
      to: 'test@example.com',
      subject: 'Integration Test',
      template: EmailTemplateEnum.WEATHER_UPDATE,
      context: {
        city: 'Test City',
        temperature: 25,
        frequency: SubscriptionFrequencyEnum.DAILY,
      },
    };

    publish(EMAIL_EVENT_PATTERNS.SEND_EMAIL, dto);
    await scheduler.wait(300);

    expect(sendEmailMock).toHaveBeenCalledWith(dto);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
  });

  it('should ignore unknown event patterns', async () => {
    publish('some.unknown.pattern', { test: 1 });
    await scheduler.wait(300);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
