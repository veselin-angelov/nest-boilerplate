import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { app, database, jwt, logger, redis } from '@app/config';
import { DatabaseModule } from '@app/shared/database/database.module';
import { LoggerModule } from '@app/shared/logger/logger.module';
import { FilterModule } from '@app/shared/filter/filter.module';
import { QueueModule } from '@app/shared/queue/queue.module';
import { EntitiesModule } from '@app/shared/entities/entities.module';

@Global()
@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: [database, app, logger, jwt, redis],
      envFilePath: `.env`,
    }),
    FilterModule,
    DatabaseModule,
    LoggerModule,
    QueueModule,
    EntitiesModule,
  ],
  exports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    FilterModule,
    EntitiesModule,
  ],
})
export class SharedModule {}
