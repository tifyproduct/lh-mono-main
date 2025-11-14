import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const appConfig = config.get('app');
const logger = new Logger('AppBootstrap');

async function bootstrap() {
  const port = appConfig.port || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

bootstrap().then(() => {
  logger.log(`App running on port ${appConfig.port}`);
});
