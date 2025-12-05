import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new ThrottlerGuard());
  
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway is running on: http://localhost:${port}`);
}

bootstrap();

