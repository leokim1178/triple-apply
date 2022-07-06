import { DocumentBuilder } from '@nestjs/swagger';

export class BaseApiDocumentation {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Triple Mileage Service API Server')
      .setDescription('트리플 백엔드 지원 수행과제 API 서버입니다')
      .setVersion('1.0')
      .build();
  }
}
