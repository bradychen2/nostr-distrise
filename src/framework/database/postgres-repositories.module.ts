import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModel } from 'src/framework/database/models/Event.model';
import { PostgresDataServices } from './postgres-data-services.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDataServices } from '../data-services/abstract/data-services.abstract';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          synchronize: false,
          retryDelay: 3000,
          entities: [__dirname + '/**/*.model.{js,ts}'],
        };
      },
    }),
    TypeOrmModule.forFeature([EventModel]),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: PostgresDataServices,
    },
  ],
  exports: [IDataServices],
})
export class PostgresDataServicesModule {}
