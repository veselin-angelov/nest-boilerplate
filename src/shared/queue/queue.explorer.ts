import { DiscoveryService, Reflector } from '@nestjs/core';
import { Injectable, OnModuleInit, Type } from '@nestjs/common';
import { CONSUMER_METADATA } from '@app/shared/queue/decorators/consumer.decorator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IJobProcessor } from '@app/shared/queue/interfaces';

@Injectable()
export class QueueExplorer implements OnModuleInit {
  public readonly jobs: Map<string, IJobProcessor> = new Map();

  public constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly queueName: string,
  ) {}

  public onModuleInit(): void {
    this.explore();
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

  private isJobProcessorForThisQueue(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Type<any> | Function,
  ): boolean {
    if (!target) {
      return false;
    }

    const metadata = this.reflector.get(CONSUMER_METADATA, target);

    return !!metadata && metadata.queueName === this.queueName;
  }
}
