import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors({
    origin: ['http://localhost.dev.ixai.ai:3000', 'http://localhost:3000'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 NestJS 서버가 포트 ${process.env.PORT ?? 3001}에서 실행 중입니다.`);
}
bootstrap();
