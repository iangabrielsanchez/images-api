import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import * as path from 'path';

@Module({
  imports: [
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: path.join(process.cwd(), 'images'),
          },
        },
      },
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
