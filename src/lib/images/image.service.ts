import { StorageService } from '@codebrew/nestjs-storage';
import { Storage } from '@slynova/flydrive';
import { ConflictException, Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { IImage, IImageDocument, ImageModel } from './image.model';
import { ArrayBuffer } from 'spark-md5';
import { ImageUploadInput } from './image.types';

@Injectable()
export class ImageService extends CrudService<IImage, IImageDocument> {
  private disk: Storage;
  constructor(private storage: StorageService) {
    super(ImageModel);

    this.disk = this.storage.getDisk();
  }

  add(modelData: IImage): Promise<IImageDocument> {
    throw 'Unsupported. Use ImageService#uploadImage instead';
  }

  private generateHashFileName(file: Express.Multer.File) {
    const hash = ArrayBuffer.hash(file.buffer);
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
    );
    return `${hash}${extension}`;
  }

  async uploadImage(file: Express.Multer.File, imageUpload: ImageUploadInput) {
    const generatedName = this.generateHashFileName(file);

    const existingEntry = this.get({
      email: imageUpload.email,
      filename: generatedName,
    }).catch(() => null);

    if (existingEntry !== null) {
      throw new ConflictException('Image was already uploaded');
    }

    const [diskResponse, dbResponse] = await Promise.all([
      this.disk.put(generatedName, file.buffer),
      super.add({
        filename: generatedName,
        description: imageUpload.description,
        uploaderEmail: imageUpload.email,
      }),
    ]);

    return dbResponse.toObject();
  }
}
