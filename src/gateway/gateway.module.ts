import { Module } from '@nestjs/common';
import { EventGateway } from './event-gateway';
import { UseCaseModule } from 'src/use-cases/use-cases.module';
import { EventPresenter } from '../interface/presenter/event-presenter';
import { ReqPresenter } from 'src/interface/presenter/request-presenter';

@Module({
  imports: [UseCaseModule],
  controllers: [],
  providers: [EventGateway, EventPresenter, ReqPresenter],
  exports: [EventGateway],
})
export class GatewayModule {}
