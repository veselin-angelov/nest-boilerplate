import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@app/shared/entities/user/entities';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User],
    }),
  ],
  exports: [MikroOrmModule],
})
export class EntitiesModule {}
