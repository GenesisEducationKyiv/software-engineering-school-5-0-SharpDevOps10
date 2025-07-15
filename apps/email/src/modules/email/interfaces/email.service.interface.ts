import { SendEmailDto } from '../dto/send-email.dto';

export interface IEmailService {
  sendEmail(dto: SendEmailDto): Promise<void>;
}
