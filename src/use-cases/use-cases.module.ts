import { Module } from '@nestjs/common';
import { EventUseCase } from './client/event-use-case';
import { DataServicesModule } from 'src/framework/data-services/data-services.module';
import { ReqUseCase } from './client/request-use-case';
import { NoticeUseCase } from './client/notice-use-case';

@Module({
  imports: [DataServicesModule],
  controllers: [],
  providers: [EventUseCase, ReqUseCase, NoticeUseCase],
  exports: [EventUseCase, ReqUseCase, NoticeUseCase],
})
export class UseCaseModule {}
