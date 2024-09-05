import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SharedModule } from '@app/shared/shared.module';
import { HealthCheckModule } from '@app/health-check/health-check.module';
import { AccessLoggingMiddleware } from '@app/shared/middlewares';
import { AppController } from '@app/app.controller';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [SharedModule, HealthCheckModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessLoggingMiddleware)
      .exclude('health-check', 'dev-tools(.*)')
      .forRoutes('*');
  }
}
