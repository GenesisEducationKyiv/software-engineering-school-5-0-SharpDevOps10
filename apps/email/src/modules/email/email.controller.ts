import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { EMAIL_DI_TOKENS } from './constants/di-tokens';
import { IEmailService } from './interfaces/email.service.interface';
import { EmailServiceMethods, GRPC_EMAIL_SERVICE } from './constants/grpc-methods';
import { Empty } from '@generated/common/empty';
import { SendEmailRequest } from '@generated/email';
import { EmailTemplateMapper } from '@utils/proto-mappers/email-template.mapper';

@GrpcService()
export class EmailController {
  constructor (
    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  @GrpcMethod(GRPC_EMAIL_SERVICE, EmailServiceMethods.SEND_EMAIL)
  async sendConfirmationEmail (request: SendEmailRequest): Promise<Empty> {
    const dto = {
      ...request,
      template: EmailTemplateMapper.fromGrpc(request.template),
    };

    await this.emailService.sendEmail(dto);

    return {};
  }

}
