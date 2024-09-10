import { BullModule, Processor } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';
import { REDIS_CONFIG_KEY, RedisConfig } from '@app/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardBasicAuthMiddleware } from '@app/shared/queue/middleware';
import { CustomQueueAdapter } from '@app/shared/queue/adapters/custom-queue.adapter';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { QueueProcessor } from '@app/shared/queue/queue.processor';
import { QueueExplorer } from '@app/shared/queue/queue.explorer';

@Module({
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
      useFactory: () => ({
        route: '/dev-tools/queues',
        adapter: ExpressAdapter,
        middleware: [BullBoardBasicAuthMiddleware],
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {
  static registerQueue(name: string): DynamicModule {
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
      providers: [
        {
          inject: [DiscoveryService, Reflector],
          provide: QueueExplorer,
          useFactory: (
            discoveryService: DiscoveryService,
            reflector: Reflector,
          ) => new QueueExplorer(reflector, discoveryService, name),
        },
        this.createQueueProcessor(name),
      ],
      exports: [BullModule],
    };
  }

  private static createQueueProcessor(queueName: string) {
    @Processor(queueName)
    class DynamicQueueProcessor extends QueueProcessor {}

    return {
      provide: QueueProcessor,
      inject: [QueueExplorer],
      useFactory: (queueExplorer: QueueExplorer) => {
        return new DynamicQueueProcessor(queueExplorer);
      },
    };
  }
}
