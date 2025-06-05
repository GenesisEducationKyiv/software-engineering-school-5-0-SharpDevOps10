import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe implements PipeTransform {
  constructor () {
    super({
      exceptionFactory: () => new BadRequestException('Invalid input'),
    });
  }

  transform (value: string, metadata: ArgumentMetadata): Promise<string> {
    return super.transform(value, metadata);
  }
}
