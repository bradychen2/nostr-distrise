import { Module } from '@nestjs/common';
import { PublishEventUseCase } from './client/publish-event-use-case';
import { DataServicesModule } from 'src/framework/data-services/data-services.module';
import { ReqUseCase } from './client/request-use-case';

@Module({
  imports: [DataServicesModule],
  controllers: [],
  providers: [PublishEventUseCase, ReqUseCase],
  exports: [PublishEventUseCase, ReqUseCase],
})
export class UseCaseModule {}
