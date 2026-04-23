import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HandlerExceptions } from './filters/exceptions/handler.exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HandlerExceptions());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
