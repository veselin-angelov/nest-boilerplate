import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export class QueueLogger extends Logger {
  public constructor(
    private readonly logger: Logger,
    private readonly job: Job,
  ) {
    super();
  }

  public async log(message: string): Promise<void> {
    this.logger.log(message);
    await this.job.log(message);
  }

  public error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }

  public async warn(message: string): Promise<void> {
    this.logger.warn(message);
    await this.job.log(`Warn: ${message}`);
  }
}
