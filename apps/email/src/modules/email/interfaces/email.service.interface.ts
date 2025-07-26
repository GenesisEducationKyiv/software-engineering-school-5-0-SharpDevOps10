import { SendEmailDto } from '../dto/send-email.dto';

export interface EmailServiceInterface {
  sendEmail(dto: SendEmailDto): Promise<void>;
}
