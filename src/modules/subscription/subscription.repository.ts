import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor (private readonly prismaService: PrismaService) {}

  async findByEmailAndCity (email: string, city: string): Promise<Subscription> {
    return this.prismaService.subscription.findFirst({
      where: {
        email,
        city,
      },
    });
  }

  async createSubscription (data: CreateSubscriptionDto & { token: string }): Promise<void> {
    await this.prismaService.subscription.create({
      data: {
        email: data.email,
        city: data.city,
        frequency: data.frequency,
        token: data.token,
        confirmed: false,
      },
    });
  }

  async findByToken (token: string): Promise<Subscription> {
    return this.prismaService.subscription.findFirst({
      where: {
        token,
      },
    });
  }

  async updateSubscription (id: string, data: Partial<Subscription>): Promise<void> {
    await this.prismaService.subscription.update({
      where: { id },
      data,
    });
  }

  async deleteSubscription (id: string): Promise<void> {
    await this.prismaService.subscription.delete({
      where: { id },
    });
  }

  async getConfirmedSubscriptions (): Promise<Subscription[]> {
    return this.prismaService.subscription.findMany({
      where: { confirmed: true },
    });
  }
}
