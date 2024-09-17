export const REDIS_CONFIG_KEY = 'redis';

export type RedisConfig = {
  host: string;
  port: number;
  prefix: string;
  ttl: number;
  username: string;
  password: string;
};

export const redis = (): {
  [REDIS_CONFIG_KEY]: RedisConfig;
} => ({
  [REDIS_CONFIG_KEY]: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT),
    ttl: Number(process.env.REDIS_TTL),
    prefix: process.env.REDIS_PREFIX as string,
    username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string,
  },
});
