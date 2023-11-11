import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';

async function bootstrap() {
  const port = process.env.NODE_SERVER_APP_PORT;
  if (!port) throw new Error('PORT not defined');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new TelegrafExceptionFilter());

  await app.listen(port);
}

bootstrap();
