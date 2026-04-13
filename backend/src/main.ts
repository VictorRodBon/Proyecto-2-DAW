import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS, // Puerto de Vite (frontend)
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`App corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
