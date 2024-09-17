import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from '@app/health-check/http';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CONFIG_KEY, RedisConfig } from '@app/config';

@Module({
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, port, username, password } =
          configService.get<RedisConfig>(REDIS_CONFIG_KEY)!;

        return new Redis({ host, port, username, password });
      },
    },
  ],
  imports: [TerminusModule, RedisHealthModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
