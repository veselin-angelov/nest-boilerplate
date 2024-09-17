import type { CacheAdapter } from '@mikro-orm/core';
import type { Redis, RedisOptions } from 'ioredis';
import IORedis from 'ioredis';
import { deserialize, serialize } from 'node:v8';

export interface BaseOptions {
  expiration?: number;
  keyPrefix?: string;
  debug?: boolean;
}

export interface BuildOptions extends BaseOptions, RedisOptions {}

export interface ClientOptions extends BaseOptions {
  client: Redis;
  logger: (...args: unknown[]) => void;
}

export type RedisCacheAdapterOptions = BuildOptions | ClientOptions;

export class RedisCacheAdapter implements CacheAdapter {
  private readonly client: Redis;
  private readonly debug: boolean;
  private readonly expiration?: number;
  private readonly keyPrefix!: string;
  private readonly logger: (...args: unknown[]) => void;

  constructor(options: RedisCacheAdapterOptions) {
    const { debug = false, expiration, keyPrefix } = options;
    this.logger = (options as ClientOptions).logger ?? console.log;

    this.keyPrefix = keyPrefix || 'mikro';
    this.client = this.createRedisClient(options);
    this.debug = debug;
    this.expiration = expiration;
    this.logDebugMessage(
      `The Redis client for cache has been created! | Cache expiration: ${this.expiration}ms`,
    );
  }

  private createRedisClient(options: RedisCacheAdapterOptions): Redis {
    if ((options as ClientOptions).client) {
      return (options as ClientOptions).client;
    } else {
      const redisOpt = options as BuildOptions;
      return new IORedis(redisOpt);
    }
  }

  private logDebugMessage(message: string) {
    if (this.debug) {
      this.logger(message);
    }
  }

  private getKey(name: string) {
    return `${this.keyPrefix}:${name}`;
  }

  private async deleteKeysByPattern(pattern: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = this.client.scanStream({
        match: pattern,
      });

      const pipeline = this.client.pipeline();

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          keys.forEach((key) => pipeline.del(key));
        }
      });

      stream.on('end', () => {
        pipeline.exec((error) => {
          if (error) {
            this.logDebugMessage('Error clearing cache');
            return reject(error);
          }
          this.logDebugMessage('Cleared cache');
          resolve();
        });
      });
    });
  }

  public async get<T = unknown>(key: string): Promise<T | undefined> {
    const completeKey = this.getKey(key);
    const data = await this.client.getBuffer(completeKey);

    if (!data) {
      this.logDebugMessage(`Get "${completeKey}": "null"`);
      return undefined;
    }

    let deserialized: T;
    try {
      deserialized = deserialize(data) as T;
    } catch (error) {
      this.logDebugMessage(`Failed to deserialize data: ${data}`);
      return undefined;
    }

    this.logDebugMessage(
      `Get "${completeKey}": "${JSON.stringify(deserialized)}"`,
    );

    return deserialized;
  }

  public async set(
    key: string,
    data: any,
    _origin: string,
    expiration = this.expiration,
  ): Promise<void> {
    let serialized: Buffer;
    try {
      serialized = serialize(data);
    } catch (error) {
      this.logDebugMessage(`Failed to serialize data: ${data}`);
      return;
    }

    const completeKey = this.getKey(key);

    if (expiration) {
      await this.client.set(completeKey, serialized, 'PX', expiration);
    } else {
      await this.client.set(completeKey, serialized);
    }

    this.logDebugMessage(
      `Set "${completeKey}": "${JSON.stringify(
        data,
      )}" with cache expiration ${expiration}ms`,
    );
  }

  public async remove(name: string): Promise<void> {
    const completeKey = this.getKey(name);
    this.logDebugMessage(`Remove specific key cache =>> ${completeKey}`);

    if (completeKey.endsWith('*')) {
      await this.deleteKeysByPattern(completeKey);
      return;
    }

    await this.client.del(completeKey);
  }

  public async clear(): Promise<void> {
    this.logDebugMessage('Clearing cache...');
    await this.deleteKeysByPattern(`${this.keyPrefix}:*`);
  }

  async close() {
    this.client.disconnect();
  }
}

export default RedisCacheAdapter;
