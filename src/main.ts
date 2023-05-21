import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventAdapter } from './gateway/event-adaptor';
import { NoticeUseCase } from './use-cases/client/notice-use-case';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new EventAdapter(app, new NoticeUseCase()));
  await app.listen(8080);
}
bootstrap();
