import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_CONFIG_KEY,
  AppConfig,
  DATABASE_CONFIG_KEY,
  DatabaseConfig,
  options,
  REDIS_CONFIG_KEY,
  RedisConfig,
} from '@app/config';
import { Environments } from '@app/shared/enums';
import RedisCacheAdapter from '@app/shared/database/redis-cache-adapter';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, user, port, password, dbName } =
          configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY)!;
        const redisConfig = configService.get<RedisConfig>(REDIS_CONFIG_KEY)!;

        const { environment } = configService.get<AppConfig>(APP_CONFIG_KEY)!;

        return {
          ...options,
          user,
          host,
          port,
          password,
          dbName,
          debug: environment !== Environments.PRODUCTION,
          entities: [],
          discovery: {
            requireEntitiesArray: true,
            warnWhenNoEntities: false,
          },
          resultCache: {
            adapter: RedisCacheAdapter,
            options: {
              host: redisConfig.host,
              port: redisConfig.port,
              username: redisConfig.username,
              password: redisConfig.password,
            },
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
