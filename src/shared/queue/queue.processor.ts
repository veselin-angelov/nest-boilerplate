import { Job } from 'bullmq';
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { IJobProcessor } from '@app/shared/queue/interfaces';
import { QueueExplorer } from '@app/shared/queue/queue.explorer';

export abstract class QueueProcessor
  extends WorkerHost
  implements IJobProcessor
{
  public constructor(private readonly queueExplorer: QueueExplorer) {
    super();
  }

  public async process(job: Job): Promise<void> {
    const jobConsumer = this.queueExplorer.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    await jobConsumer.process(job);
  }

  @OnWorkerEvent('failed')
  public async failed(job: Job, error: Error): Promise<void> {
    const jobConsumer = this.queueExplorer.jobs.get(job.name);

    if (!jobConsumer || !jobConsumer.failed) {
      return;
    }

    await jobConsumer.failed(job, error);
  }

  @OnWorkerEvent('active')
  public async active(job: Job, prev: string): Promise<void> {
    const jobConsumer = this.queueExplorer.jobs.get(job.name);

    if (!jobConsumer || !jobConsumer.active) {
      return;
    }

    await jobConsumer.active(job, prev);
  }

  @OnWorkerEvent('completed')
  public async completed(job: Job, result: any): Promise<void> {
    const jobConsumer = this.queueExplorer.jobs.get(job.name);

    if (!jobConsumer || !jobConsumer.completed) {
      return;
    }

    await jobConsumer.completed(job, result);
  }

  @OnWorkerEvent('progress')
  public async progress(job: Job, progress: number | object): Promise<void> {
    const jobConsumer = this.queueExplorer.jobs.get(job.name);

    if (!jobConsumer || !jobConsumer.progress) {
      return;
    }

    await jobConsumer.progress(job, progress);
  }
}
