import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@modules/app/app.module';
import { PrismaClient } from '@prisma/client';
import { IEmailService } from '@shared/interfaces/email-service.interface';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';
import { CreateSubscriptionDto } from '@subscription/presentation/dto/create-subscription.dto';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';
import { configServiceMock } from '../../mocks/configs/config.service.mock';

describe('SubscriptionController', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const mockEmailService: IEmailService = {
    sendConfirmationEmail: jest.fn(),
    sendWeatherUpdateEmail: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_DI_TOKENS.EMAIL_SERVICE)
      .useValue(mockEmailService)
      .overrideProvider(CONFIG_DI_TOKENS.CONFIG_SERVICE)
      .useValue(configServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('POST /subscribe 201 + creates subscription', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    const res = await request(app.getHttpServer()).post('/subscribe').send(dto);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Subscription successful. Confirmation email sent.',
    });

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });

    expect(sub).toMatchObject({
      email: dto.email,
      city: dto.city,
      frequency: dto.frequency,
      confirmed: false,
    });

    expect(sub?.token).toEqual(
      expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
    );
  });

  it('GET /confirm/:token 200 + marks as confirmed', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'test-e2e@example.com',
      city: 'Berlin',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await request(app.getHttpServer()).post('/subscribe').send(dto);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { email: dto.email },
    });

    const res = await request(app.getHttpServer())
      .get(`/confirm/${subscription.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Subscription confirmed successfully',
    });

    const updated = await prisma.subscription.findUnique({
      where: { id: subscription.id },
    });

    expect(updated?.confirmed).toBe(true);
  });

  it('GET /confirm/:token 400 (invalid UUID)', async () => {
    const res = await request(app.getHttpServer())
      .get('/confirm/not-a-uuid')
      .send();

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid input');
  });

  it('GET /confirm/:token 404 (token not found)', async () => {
    const fakeToken = 'b0f26e58-1234-4a65-a9b0-000000000000';

    const res = await request(app.getHttpServer())
      .get(`/confirm/${fakeToken}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Token not found');
  });

  it('GET /unsubscribe/:token 200 + deletes subscription', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'unsubscribe@example.com',
      city: 'Lviv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await request(app.getHttpServer()).post('/subscribe').send(dto);
    const sub = await prisma.subscription.findFirstOrThrow({
      where: { email: dto.email },
    });

    await request(app.getHttpServer()).get(`/confirm/${sub.token}`).send();

    const res = await request(app.getHttpServer())
      .get(`/unsubscribe/${sub.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Unsubscribed successfully',
    });

    const deleted = await prisma.subscription.findUnique({ where: { id: sub.id } });
    expect(deleted).toBeNull();
  });

  it('GET /unsubscribe/:token 400 (invalid UUID)', async () => {
    const res = await request(app.getHttpServer())
      .get('/unsubscribe/not-a-uuid')
      .send();

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid input');
  });

  it('GET /unsubscribe/:token 404 (not found)', async () => {
    const fakeToken = '01234567-89ab-cdef-0123-456789abcdef';

    const res = await request(app.getHttpServer())
      .get(`/unsubscribe/${fakeToken}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Token not found');
  });
});
