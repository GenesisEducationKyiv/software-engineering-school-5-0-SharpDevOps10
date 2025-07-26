import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EmailService, SendEmailRequest } from '@generated/email';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '@shared-types/common/grpc-to-observable';
import { Empty } from '@generated/common/empty';
import { IEmailClient } from '@shared-types/email/email-client.interface';

@Injectable()
export class EmailClientService implements IEmailClient, OnModuleInit {
  private emailClient: GrpcToObservable<EmailService>;

  constructor (
    @Inject(CLIENTS_PACKAGES.EMAIL_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}
  
  onModuleInit (): void {
    this.emailClient = this.client.getService<EmailService>('EmailService');
  }

  async sendEmail (dto: SendEmailRequest): Promise<Empty> {
    return await lastValueFrom(this.emailClient.SendEmail(dto));
  }

}
