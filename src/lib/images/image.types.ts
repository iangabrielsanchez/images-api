import { ApiProperty } from '@nestjs/swagger';

export class Image {
  filename: string;
}

export class ImageParams {
  id: string;
}

export class ImageUploadInput {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
