import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.NODE_SERVER_PORT;
  if (!port) throw new Error('PORT not defined');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(port);
}

bootstrap();
