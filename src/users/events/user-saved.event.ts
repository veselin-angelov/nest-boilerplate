import { EntityDTO } from '@mikro-orm/core';
import { IEvent } from '@nestjs/cqrs';
import { User } from '@app/shared/entities/user/entities';

export class UserSavedEvent implements IEvent {
  public constructor(
    public readonly user: EntityDTO<User>,
    public readonly oldState: EntityDTO<User> | null,
  ) {}
}
