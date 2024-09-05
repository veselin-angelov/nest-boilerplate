import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@app/users/entities';
import { MeController, UsersController } from '@app/users/http';
import { DeleteUserConsumer } from '@app/users/consumers';
import { EmailUniqueConstraint } from '@app/users/constraints';
import { DeleteUserHandler, SaveUserHandler } from '@app/users/commands';
import {
  CurrentUserHandler,
  UserHandler,
  UsersHandler,
} from '@app/users/queries';
import { BullModule } from '@nestjs/bullmq';
import { USER_QUEUE } from '@app/users/constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { CustomQueueAdapter } from '@app/shared/queue';
import { QueueModule } from '@app/shared/queue/queue.module';

const queryHandlers = [UsersHandler, UserHandler, CurrentUserHandler];

const commandHandlers = [SaveUserHandler, DeleteUserHandler];

const constraints = [EmailUniqueConstraint];

const consumers = [DeleteUserConsumer];

// const queueProcessors = [UsersQueueProcessor];

const sharedProviders = [
  ...queryHandlers,
  ...commandHandlers,
  ...constraints,
  // ...queueProcessors,
  ...consumers,
];

const controllers = [UsersController, MeController];

@Module({
  imports: [
    // DiscoveryModule,
    CqrsModule,
    MikroOrmModule.forFeature({
      entities: [User],
    }),
    BullModule.registerQueue({
      name: USER_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: USER_QUEUE,
      adapter: CustomQueueAdapter,
    }),
    forwardRef(() => QueueModule.forFeature(USER_QUEUE)), //, UsersQueueProcessor),
  ],
  exports: [...sharedProviders, MikroOrmModule],
  providers: [...sharedProviders],
  controllers,
})
export class UsersModule {
  // This is just an example of how to configure a job to run every day at midnight
  // constructor(@InjectQueue(USER_QUEUE) private readonly queue: Queue) {}
  //
  // async configure() {
  //   await this.queue.add(
  //     DeleteUserConsumer.jobName,
  //     {
  //       userId: '1',
  //     },
  //     { repeat: { pattern: '0 0 * * *' } },
  //   );
  // }
}
