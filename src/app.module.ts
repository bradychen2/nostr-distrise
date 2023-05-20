import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { SocketClientModule } from './client/socket-client.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DataServicesModule } from './framework/data-services/data-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
      isGlobal: true,
    }),
    SocketClientModule,
    DataServicesModule,
    GatewayModule,
  ],
})
export class AppModule {}
