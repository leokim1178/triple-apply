import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';
import { PlaceModule } from './apis/place/place.module';
import { ReviewModule } from './apis/review/review.module';
import { EventModule } from './apis/event/event.module';
import { PointLogModule } from './apis/pointLog/pointLog.module';

@Module({
  imports: [
    UserModule,
    PlaceModule,
    ReviewModule,
    EventModule,
    PointLogModule,
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
      timezone: 'Z',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
