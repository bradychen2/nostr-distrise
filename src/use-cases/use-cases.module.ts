import { Module } from '@nestjs/common';
import { PublishEventUseCase } from './client/publish-event-use-case';
import { DataServicesModule } from 'src/framework/data-services/data-services.module';

@Module({
  imports: [DataServicesModule],
  controllers: [],
  providers: [PublishEventUseCase],
  exports: [PublishEventUseCase],
})
export class UseCaseModule {}
