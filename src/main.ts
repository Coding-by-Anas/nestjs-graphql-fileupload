import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  );

  /**
   * Uncommenting global ValidationPipe will make grapqhl file upload stop working
   */

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: false,
  //     transform: false
  //   })
  // )

  await app.listen(3000);
}
bootstrap();
