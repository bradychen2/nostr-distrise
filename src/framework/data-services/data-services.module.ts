import { Module } from '@nestjs/common';
import { PostgresDataServicesModule } from '../database/postgres-repositories.module';

@Module({
  imports: [PostgresDataServicesModule],
  exports: [PostgresDataServicesModule],
})
export class DataServicesModule {}
