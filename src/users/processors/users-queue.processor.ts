import { Processor } from '@nestjs/bullmq';
import { QueueProcessor } from '@app/shared/queue';
import { USER_QUEUE } from '@app/users/constants';

@Processor(USER_QUEUE)
export class UsersQueueProcessor extends QueueProcessor {
  queueName = USER_QUEUE;
}
