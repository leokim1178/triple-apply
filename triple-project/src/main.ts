import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception-filter';

import { BaseApiDocumentation } from './config/baseApiDocs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());

  const documentOptions = new BaseApiDocumentation().initializeOptions();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
