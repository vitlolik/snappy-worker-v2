import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new TelegrafExceptionFilter());

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
