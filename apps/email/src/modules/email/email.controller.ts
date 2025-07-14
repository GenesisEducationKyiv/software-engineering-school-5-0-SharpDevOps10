import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { IEmailService } from './interfaces/email.service.interface';
import { EmailServiceMethods, GRPC_EMAIL_SERVICE } from './constants/grpc-methods';
import { Empty } from '@generated/common/empty';
import {
  SendConfirmationEmailRequest,
  SendWeatherUpdateEmailRequest,
} from '@generated/email';

@GrpcService()
export class EmailController {
  constructor (
    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  @GrpcMethod(GRPC_EMAIL_SERVICE, EmailServiceMethods.SEND_CONFIRMATION_EMAIL)
  async sendConfirmationEmail (request: SendConfirmationEmailRequest): Promise<Empty> {
    await this.emailService.sendConfirmationEmail(request);

    return {};
  }

  @GrpcMethod(GRPC_EMAIL_SERVICE, EmailServiceMethods.SEND_WEATHER_UPDATE_EMAIL)
  async sendWeatherUpdateEmail (request: SendWeatherUpdateEmailRequest): Promise<Empty> {
    await this.emailService.sendWeatherUpdateEmail(request);

    return {};
  }
}
