import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = [
    "http://localhost:3000",
    "https://localhost:3000",
    ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Translate Platform API")
    .setDescription("번역 플랫폼 API 문서")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 NestJS 서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
