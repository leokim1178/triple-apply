import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { BaseApiDocumentation } from './config/baseApiDocs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentOptions = new BaseApiDocumentation().initializeOptions();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
