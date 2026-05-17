import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL || 'https://file-transfer-system-1-nmvu.onrender.com/',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();