import { Job } from 'bullmq';
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Injectable, OnModuleInit, Type } from '@nestjs/common';
import { CONSUMER_METADATA } from '@app/shared/queue/decorators/consumer.decorator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IJobProcessor } from '@app/shared/queue/interfaces';

@Injectable()
export abstract class QueueProcessor
  extends WorkerHost
  implements IJobProcessor, OnModuleInit
{
  private readonly jobs: Map<string, IJobProcessor> = new Map();
  protected readonly queueName: string;

  public constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
  ) {
    super();
  }

  public onModuleInit(): void {
    this.explore();
  }

  public async process(job: Job): Promise<void> {
    const jobConsumer = this.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    await jobConsumer.process(job);
  }

  @OnWorkerEvent('failed')
  public async failed(job: Job, error: Error): Promise<void> {
    const jobConsumer = this.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    if (!jobConsumer.failed) {
      return;
    }

    await jobConsumer.failed(job, error);
  }

  @OnWorkerEvent('active')
  public async active(job: Job, prev: string): Promise<void> {
    const jobConsumer = this.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    if (!jobConsumer.active) {
      return;
    }

    await jobConsumer.active(job, prev);
  }

  @OnWorkerEvent('completed')
  public async completed(job: Job, result: any): Promise<void> {
    const jobConsumer = this.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    if (!jobConsumer.completed) {
      return;
    }

    await jobConsumer.completed(job, result);
  }

  @OnWorkerEvent('progress')
  public async progress(job: Job, progress: number | object): Promise<void> {
    const jobConsumer = this.jobs.get(job.name);

    if (!jobConsumer) {
      throw new Error(`Job consumer not found for job: ${job.name}`);
    }

    if (!jobConsumer.progress) {
      return;
    }

    await jobConsumer.progress(job, progress);
  }

  private explore(): void {
    const providers = this.discoveryService.getProviders();
    const jobProcessors = providers.filter((wrapper: InstanceWrapper) =>
      this.isJobProcessorForThisQueue(
        !wrapper.metatype || wrapper.inject
          ? wrapper.instance?.constructor
          : wrapper.metatype,
      ),
    );

    for (const jobProcessor of jobProcessors) {
      const metadata = this.reflector.get(
        CONSUMER_METADATA,
        jobProcessor.metatype,
      );
      const instance: IJobProcessor = jobProcessor.instance;

      if (!instance.process) {
        throw new Error(
          `Job processor must implement IJobProcessor interface: ${metadata.jobName}`,
        );
      }

      this.jobs.set(metadata.jobName, instance);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private isJobProcessorForThisQueue(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }

    const metadata = this.reflector.get(CONSUMER_METADATA, target);

    return !!metadata && metadata.queueName === this.queueName;
  }
}
