import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';
import { REDIS_CONFIG_KEY, RedisConfig } from '@app/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardBasicAuthMiddleware } from '@app/shared/queue/middleware';
import { UsersModule } from '@app/users/users.module';
import { CustomQueueAdapter } from '@app/shared/queue/adapters/custom-queue.adapter';
import { DiscoveryModule } from '@nestjs/core';

@Module({})
export class QueueModule {
  static forRoot(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: (configService: ConfigService): QueueOptions => {
            const { host, port, prefix } =
              configService.get<RedisConfig>(REDIS_CONFIG_KEY)!;

            return {
              connection: {
                host: host,
                port: port,
              },
              defaultJobOptions: {
                attempts: 3,
                removeOnComplete: 50,
                removeOnFail: 100,
                backoff: {
                  delay: 300000,
                  type: 'exponential',
                },
              },
              prefix: `queue-${prefix}`,
            };
          },
        }),
        BullBoardModule.forRootAsync({
          imports: [forwardRef(() => UsersModule)],
          useFactory: () => ({
            route: '/dev-tools/queues',
            adapter: ExpressAdapter,
            middleware: [BullBoardBasicAuthMiddleware],
          }),
        }),
      ],
      exports: [BullModule],
    };
  }

  static forFeature(name: string): DynamicModule {
    //, cls: Type<QueueProcessor>) {
    return {
      module: QueueModule,
      imports: [
        DiscoveryModule,
        BullModule.registerQueue({
          name,
        }),
        BullBoardModule.forFeature({
          name,
          adapter: CustomQueueAdapter,
        }),
      ],
      // providers: [
      //   {
      //     provide: QueueProcessor,
      //     useClass: cls,
      //   },
      // ],
    };
  }
}
