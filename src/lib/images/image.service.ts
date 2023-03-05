import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { IImage, IImageDocument, ImageModel } from './image.model';

@Injectable()
export class ImageService extends CrudService<IImage, IImageDocument> {
  constructor() {
    super(ImageModel);
  }

  uploadImage(
    file: Express.Multer.File
  ) {
    // to implement
  }
}
