import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import Redis from 'ioredis';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mikroOrmIndicator: MikroOrmHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly redis: Redis,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.mikroOrmIndicator.pingCheck('database'),
      () =>
        this.redisIndicator.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
        }),
    ]);
  }
}
