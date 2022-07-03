import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database-server',
      port: 3306,
      username: 'root',
      password: '1178',
      database: 'triple-database',
      entities: [__dirname + '/apis/**/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
      timezone: 'Asia/Seoul',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
