import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Image {
  filename: string;
}

export class ImageParams {
  @IsString()
  id: string;
}

export class ImageUploadInput {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
  email: string;
  description?: string;
}
