import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigModule } from '@nestjs/config';
import { SUBSCRIPTION_EVENT_PATTERNS } from '@utils/constants/brokers/subscription-event.pattern';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { scheduler } from 'node:timers/promises';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@utils/constants/brokers/queues';
import type { Subscription } from '@prisma/client';
import { ISubscriptionService } from '../application/interfaces/subscription.service.interface';
import { SubscriptionModule } from '../subscription.module';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';

describe('SubscriptionConsumer (integration)', () => {
  let app: INestApplication;
  let channelModel: amqp.ChannelModel;
  let channel: amqp.Channel;

  const getConfirmedSubscriptionsMock = jest.fn();

  const subscriptionServiceMock: Partial<ISubscriptionService> = {
    getConfirmedSubscriptions: getConfirmedSubscriptionsMock,
  };

  let publish: (pattern: string, data: object) => void;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'apps/subscription/.env.test',
        }),
        SubscriptionModule,
      ],
    })
      .overrideProvider(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
      .useValue(subscriptionServiceMock)
      .compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: QUEUES.SUBSCRIPTION_QUEUE,
        queueOptions: { durable: false },
        noAck: false,
      },
    });

    await app.startAllMicroservices();
    await scheduler.wait(300);
    await app.init();

    channelModel = await amqp.connect('amqp://localhost:5672');
    channel = await channelModel.createChannel();
    await channel.assertQueue(QUEUES.SUBSCRIPTION_QUEUE, { durable: false });
    await channel.bindQueue(QUEUES.SUBSCRIPTION_QUEUE, 'amq.topic', SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS);

    publish = (pattern: string, data: object): void => {
      channel.publish(
        'amq.topic',
        pattern,
        Buffer.from(JSON.stringify({ pattern, data })),
        { contentType: 'application/json' },
      );
    };
  });

  afterAll(async () => {
    await channel.close();
    await channelModel.close();
    await app.close();
  });

  beforeEach(async () => {
    await channel.purgeQueue(QUEUES.SUBSCRIPTION_QUEUE);
    jest.clearAllMocks();
  });

  it('should consume message and return subscriptions for daily frequency', async () => {
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        email: 'user@example.com',
        city: 'Kyiv',
        confirmed: true,
        frequency: SubscriptionFrequencyEnum.DAILY,
        token: 'abc123',
        createdAt: new Date(),
      },
    ];

    getConfirmedSubscriptionsMock.mockResolvedValue(mockSubscriptions);

    publish(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS, {
      frequency: SubscriptionFrequencyEnum.DAILY,
    });


    await scheduler.wait(300);

    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledWith({
      frequency: SubscriptionFrequencyEnum.DAILY,
    });
    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledTimes(1);
  });

  it('should consume message and return subscriptions for HOURLY frequency', async () => {
    const mockSubscriptions: Subscription[] = [
      {
        id: '2',
        email: 'hourly@example.com',
        city: 'Lviv',
        confirmed: true,
        frequency: SubscriptionFrequencyEnum.HOURLY,
        token: 'def456',
        createdAt: new Date(),
      },
    ];

    getConfirmedSubscriptionsMock.mockResolvedValue(mockSubscriptions);

    publish(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS, {
      frequency: SubscriptionFrequencyEnum.HOURLY,
    });

    await scheduler.wait(300);

    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledWith({
      frequency: SubscriptionFrequencyEnum.HOURLY,
    });
  });

  it('should return empty list when there are no confirmed subscriptions', async () => {
    getConfirmedSubscriptionsMock.mockResolvedValue([]);

    publish(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS, {
      frequency: SubscriptionFrequencyEnum.DAILY,
    });

    await scheduler.wait(300);

    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledWith({
      frequency: SubscriptionFrequencyEnum.DAILY,
    });
  });

  it('should handle multiple messages in sequence', async () => {
    getConfirmedSubscriptionsMock.mockResolvedValue([]);

    publish(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS, {
      frequency: SubscriptionFrequencyEnum.DAILY,
    });
    publish(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS, {
      frequency: SubscriptionFrequencyEnum.HOURLY,
    });

    await scheduler.wait(500);

    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledTimes(2);
    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledWith({
      frequency: SubscriptionFrequencyEnum.DAILY,
    });
    expect(getConfirmedSubscriptionsMock).toHaveBeenCalledWith({
      frequency: SubscriptionFrequencyEnum.HOURLY,
    });
  });


  it('should ignore unknown event patterns', async () => {
    publish('some.unknown.pattern', { test: true });

    await scheduler.wait(300);
    expect(getConfirmedSubscriptionsMock).not.toHaveBeenCalled();
  });
});
