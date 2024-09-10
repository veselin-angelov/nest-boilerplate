import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { USER_QUEUE } from '@app/users/constants';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { LOGGER } from '@app/shared/logger/constants';
import {
  Consumer,
  createQueueLogger,
  IJobProcessor,
  QueueLogger,
} from '@app/shared/queue';
import { UserRepository } from '@app/shared/entities/user/repositories';

@Consumer({
  queueName: DeleteUserConsumer.queueName,
  jobName: DeleteUserConsumer.jobName,
})
export class DeleteUserConsumer implements IJobProcessor {
  public static readonly queueName = USER_QUEUE;
  public static readonly jobName = 'user.delete';

  public constructor(
    private readonly em: EntityManager,
    private readonly userRepository: UserRepository,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async failed(
    job: Job<{ userId: string }>,
    error: Error,
  ): Promise<void> {
    const logger = createQueueLogger(this.logger, job);
    await logger.error(error.message, error.stack);
  }

  public async process(job: Job<{ userId: string }>): Promise<void> {
    const queueLogger = createQueueLogger(this.logger, job);

    await this.startSequence(queueLogger, job.data.userId);
  }

  @CreateRequestContext()
  private async startSequence(
    logger: QueueLogger,
    userId: string,
  ): Promise<void> {
    await logger.log(`User delete sequence for '${userId}' started!`);

    const user = await this.userRepository.findOneOrFail(userId);

    console.log('User:', user);

    await logger.log(`User delete sequence for '${userId}' finished!`);
  }
}
