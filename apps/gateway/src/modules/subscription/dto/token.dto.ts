import { IsNotEmpty, IsUUID } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsUUID()
    token: string;
}
