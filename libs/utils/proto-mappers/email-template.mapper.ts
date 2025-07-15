import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';
import { grpcToEmailTemplate } from './records/gprc-to-email-template.record';
import { emailTemplateToGrpcMap } from './records/email-template-to-grpc.record';

export const EmailTemplateMapper = {
  fromGrpc: (proto: string): EmailTemplateEnum => {
    const result = grpcToEmailTemplate[proto];
    if (!result) throw new Error(`Unknown proto enum: ${proto}`);

    return result;
  },

  toGrpc: (app: EmailTemplateEnum): string => {
    const result = emailTemplateToGrpcMap[app];
    if (result === undefined) throw new Error(`Unknown app enum: ${app}`);

    return result;
  },
};
