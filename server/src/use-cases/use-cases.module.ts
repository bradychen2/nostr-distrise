import { Module } from '@nestjs/common';
import { PublishEventUseCase } from './client/publish-event-use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [PublishEventUseCase],
  exports: [PublishEventUseCase],
})
export class UseCaseModule {}
