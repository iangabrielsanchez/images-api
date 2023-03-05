import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ImageParams, ImageUploadInput } from './image.types';

@Controller('images')
export class ImageController {
  @Get()
  getImages() {
    return { ok: true };
  }

  @Get(':id')
  getImage(@Param() param: ImageParams) {
    return { ok: true };
  }

  @Post('/upload')
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() param: ImageUploadInput,
  ) {
    return { ok: true };
  }
}
