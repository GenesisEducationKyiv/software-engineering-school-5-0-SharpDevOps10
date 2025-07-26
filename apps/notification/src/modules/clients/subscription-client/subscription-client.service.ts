import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '@shared-types/common/grpc-to-observable';
import { ISubscriptionNotifier } from '../../notification/application/interfaces/subscription.notifier.interface';
import {
  ConfirmedSubscriptionsResponse,
  GetConfirmedSubscriptionsRequest,
  SubscriptionService,
} from '@generated/subscription';

@Injectable()
export class SubscriptionClientService implements ISubscriptionNotifier, OnModuleInit {
  private subscriptionClient: GrpcToObservable<SubscriptionService>;

  constructor (
    @Inject(CLIENTS_PACKAGES.SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit (): void {
    this.subscriptionClient = this.client.getService<SubscriptionService>('SubscriptionService');
  }

  async getConfirmedSubscriptions (
    request: GetConfirmedSubscriptionsRequest,
  ): Promise<ConfirmedSubscriptionsResponse> {
    const resp: ConfirmedSubscriptionsResponse = await lastValueFrom(
      this.subscriptionClient.GetConfirmedSubscriptions(request),
    );

    return {
      subscriptions: resp?.subscriptions ?? [],
    };
  }
}
