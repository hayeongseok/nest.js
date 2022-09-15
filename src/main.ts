import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

/* 
유튜브 강의 https://www.youtube.com/watch?v=3JminDpCJNE
블로그 https://velog.io/@injoon2019/NestJS-%EC%9D%B8%ED%94%84%EB%9F%B0-%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-NestJS#nestjs-%EC%86%8C%EA%B0%9C
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  
  await app.listen(port);
  Logger.log("Application running on port " + port);
}
bootstrap();
