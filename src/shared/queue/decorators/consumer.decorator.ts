import { SetMetadata } from '@nestjs/common';

export const CONSUMER_METADATA = Symbol('consumer');

export interface ConsumerOptions {
  queueName: string;
  jobName: string;
}

export const Consumer = (options: ConsumerOptions): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    SetMetadata(CONSUMER_METADATA, options)(target);
  };
};
