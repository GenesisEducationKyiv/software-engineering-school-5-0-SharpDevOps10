import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from '@subscription/application/subscription.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRepository } from '@subscription/infrastructure/repositories/subscription.repository';
import { CreateSubscriptionDto } from '@subscription/presentation/dto/create-subscription.dto';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import type { IEmailService } from '@shared/interfaces/email-service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';
import { TokenService } from '@subscription/infrastructure/token/token.service';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';
import { configServiceMock } from '../../mocks/configs/config.service.mock';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaClient;

  const emailServiceMock: jest.Mocked<IEmailService> = {
    sendConfirmationEmail: jest.fn(),
    sendWeatherUpdateEmail: jest.fn(),
  };

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        PrismaService,
        TokenService,
        {
          provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY,
          useClass: SubscriptionRepository,
        },
        {
          provide: EMAIL_DI_TOKENS.EMAIL_SERVICE,
          useValue: emailServiceMock,
        },
        {
          provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE,
          useExisting: TokenService,
        },
        {
          provide: CONFIG_DI_TOKENS.CONFIG_SERVICE,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get(SubscriptionService);
  });

  it('should create subscription and send email', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const dbEntry = await prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });

    expect(dbEntry).toBeDefined();
    expect(dbEntry?.token).toBeDefined();
    expect(emailServiceMock.sendConfirmationEmail).toHaveBeenCalledWith(dto.email, dbEntry?.token);
  });

  it('should throw ConflictException if subscription already exists', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'dup@example.com',
      city: 'Lviv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    await expect(service.subscribe(dto)).rejects.toThrow(ConflictException);
  });

  it('should confirm a subscription', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'confirm@example.com',
      city: 'Odesa',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const sub = await prisma.subscription.findFirstOrThrow({
      where: { email: dto.email },
    });

    await service.confirm(sub);

    const updated = await prisma.subscription.findUnique({ where: { id: sub.id } });

    expect(updated?.confirmed).toBe(true);
  });

  it('should throw ConflictException if already confirmed', async () => {
    const dto = {
      email: 'confirmed@example.com',
      city: 'Dnipro',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });
    await service.confirm(sub);

    await expect(service.confirm({ ...sub, confirmed: true })).rejects.toThrow(ConflictException);
  });

  it('should unsubscribe confirmed user', async () => {
    const dto = {
      email: 'unsub@example.com',
      city: 'Kharkiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await service.confirm(sub);

    await service.unsubscribe({ ...sub, confirmed: true });

    const found = await prisma.subscription.findUnique({ where: { id: sub.id } });
    expect(found).toBeNull();
  });

  it('should not allow unsubscribe if not confirmed', async () => {
    const dto = {
      email: 'not-confirmed@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await expect(service.unsubscribe(sub)).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if token is expired', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'expired@example.com',
      city: 'Vienna',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100),
      },
    });

    const expiredSub = await prisma.subscription.findFirstOrThrow({ where: { id: sub.id } });

    await expect(service.confirm(expiredSub)).rejects.toThrow(BadRequestException);
  });
});
