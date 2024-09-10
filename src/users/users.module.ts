import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MeController, UsersController } from '@app/users/http';
import { DeleteUserConsumer } from '@app/users/consumers';
import { EmailUniqueConstraint } from '@app/users/constraints';
import { DeleteUserHandler, SaveUserHandler } from '@app/users/commands';
import {
  CurrentUserHandler,
  UserHandler,
  UsersHandler,
} from '@app/users/queries';
import { USER_QUEUE } from '@app/users/constants';
import { QueueModule } from '@app/shared/queue/queue.module';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

const queryHandlers = [UsersHandler, UserHandler, CurrentUserHandler];

const commandHandlers = [SaveUserHandler, DeleteUserHandler];

const constraints = [EmailUniqueConstraint];

const consumers = [DeleteUserConsumer];

const sharedProviders = [
  ...queryHandlers,
  ...commandHandlers,
  ...constraints,
  ...consumers,
];

const controllers = [UsersController, MeController];

@Module({
  imports: [CqrsModule, QueueModule.registerQueue(USER_QUEUE)],
  exports: [...sharedProviders],
  providers: [...sharedProviders],
  controllers,
})
export class UsersModule {
  // This is just an example of how to configure a job to run every day at midnight
  constructor(@InjectQueue(USER_QUEUE) private readonly queue: Queue) {}

  async configure() {
    await this.queue.add(
      DeleteUserConsumer.jobName,
      {
        userId: '1',
      },
      { repeat: { pattern: '0 0 * * *' } },
    );
  }
}
