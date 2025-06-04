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

  transform (value: any, metadata: ArgumentMetadata): Promise<string> {
    if (value === undefined || value === null) return value;

    return super.transform(value, metadata);
  }
}
