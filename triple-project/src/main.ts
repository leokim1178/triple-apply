import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception-filter';
import { BaseApiDocumentation } from './common/config/swagger/baseApiDocs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
      exceptionFactory(errors) {
        const message = Object.values(errors[0].constraints);
        throw new BadRequestException(message[0]);
      },
    }),
  );

  const documentOptions = new BaseApiDocumentation().initializeOptions();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
