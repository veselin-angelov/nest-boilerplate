import { Job } from 'bullmq';

export interface IJobProcessor {
  process: (job: Job) => Promise<void>;
  active?(job: Job, prev: string): Promise<void>;
  completed?(job: Job, result: any): Promise<void>;
  failed?(job: Job, error: Error): Promise<void>;
  progress?(job: Job, progress: number | object): Promise<void>;
}
