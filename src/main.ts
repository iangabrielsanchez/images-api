/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { glob } from 'glob';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Images API')
    .setDescription('Images API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const extraModels = await getExtraModels();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels,
  });

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      docExpansion: 'none',
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(3000);

  Logger.log(`Listening to port ${port}`);
}
bootstrap();

async function getExtraModels(): Promise<Function[]> {
  const filePaths: string[] = await glob('./**/*.types.ts');

  const functionsToExpose: Function[] = [];
  for (const path of filePaths) {
    //Remove ./src/*, and *.ts and prepend ./
    const sanitizedPath = './' + path.split('src/')[1].slice(0, -3);

    await import(sanitizedPath).then((response) => {
      const exportedFunctions: Function[] = Object.values(response);
      functionsToExpose.push(...exportedFunctions);
    });
  }
  return functionsToExpose;
};