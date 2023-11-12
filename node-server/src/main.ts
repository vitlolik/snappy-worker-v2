import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.NODE_SERVER_PORT;
  if (!port) throw new Error('PORT not defined');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(
    helmet({
      contentSecurityPolicy: false,
      xFrameOptions: false,
      xXssProtection: false,
    }),
  );

  await app.listen(port);
}

bootstrap();
