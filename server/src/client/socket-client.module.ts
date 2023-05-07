import { Module } from '@nestjs/common';
import { SocketClient } from './socket-client';
import { UseCaseModule } from 'server/src/use-cases/use-cases.module';

@Module({
  imports: [UseCaseModule],
  providers: [SocketClient],
})
export class SocketClientModule {}
