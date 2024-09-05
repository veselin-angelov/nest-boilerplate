import { Queue } from 'bullmq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QueueAdapterOptions } from '@bull-board/api/dist/typings/app';
import * as fastRedact from 'fast-redact';

export class CustomQueueAdapter extends BullMQAdapter {
  public constructor(queue: Queue, options?: Partial<QueueAdapterOptions>) {
    super(queue, options);

    const redact = fastRedact({
      paths: ['password', '*.password'],
      serialize: false,
    });

    this.setFormatter('data', (data) => redact(data));
  }
}
