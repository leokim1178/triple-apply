import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from 'src/common/filter/http-exception-filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

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

    await app.init();
  });

  it('user', () => {
    return request(app.getHttpServer()).get('user').expect(200).expect('Hello World!');
  });
});
