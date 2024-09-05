import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueLogger } from './queue.logger';

export const createQueueLogger = <T>(
  logger: Logger,
  job: Job<T>,
): QueueLogger => {
  return new QueueLogger(logger, job);
};
