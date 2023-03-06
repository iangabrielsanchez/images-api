import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { RequestUser } from '../auth/auth.decorator';
import { User } from '../user/user.types';
import { ImageService } from './image.service';
import { ImageParams, ImageUploadInput } from './image.types';

@ApiBearerAuth()
@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}
  @Get()
  getImages(@RequestUser() user: User) {
    return this.imageService.getAll({ uploaderEmail: user.email });
  }

  @Get(':id')
  getImage(@Param() param: ImageParams) {
    console.log('here,', { param });
    this.imageService.update(param.id, {
      $inc: {
        hits: 1,
      },
    } as any);
    return this.imageService.get(param.id);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() input: ImageUploadInput,
  ) {
    return this.imageService.uploadImage(file, input);
  }

  @Delete('/:id')
  deleteImage(@Param() param: ImageParams) {
    const image = this.imageService.get(param.id).catch(() => null);
    if (image === null) {
      throw new NotFoundException();
    }
    this.imageService.delete(param.id);
    return image;
  }
}
