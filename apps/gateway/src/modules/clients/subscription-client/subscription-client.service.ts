import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CreateSubscriptionRequest,
  SubscriptionService,
} from '@generated/subscription';
import { Empty } from '@generated/common/empty';
import { ManageSubscriptionInterface } from './interfaces/manage-subscription.interface';
import { GrpcToObservable } from '@grpc-types/grpc-to-observable';

@Injectable()
export class SubscriptionClientService implements ManageSubscriptionInterface, OnModuleInit {
  private subscriptionClient: GrpcToObservable<SubscriptionService>;

  constructor (
    @Inject(CLIENTS_PACKAGES.SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit (): void {
    this.subscriptionClient = this.client.getService<SubscriptionService>('SubscriptionService');
  }
  
  async subscribe (request: CreateSubscriptionRequest): Promise<Empty> {
    return await lastValueFrom(this.subscriptionClient.Subscribe(request));
  }

  async confirm (token: string): Promise<Empty> {
    return await lastValueFrom(this.subscriptionClient.Confirm({ token }));
  }

  async unsubscribe (token: string): Promise<Empty> {
    return await lastValueFrom(this.subscriptionClient.Unsubscribe({ token }));
  }
}
