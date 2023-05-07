import { Module } from '@nestjs/common';
// import { GatewayModule } from './gateway/gateway.module';
import { SocketClientModule } from './client/socket-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SocketClientModule,
    // GatewayModule,
  ],
})
export class AppModule {}
