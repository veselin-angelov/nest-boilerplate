import { User } from '@app/users/entities';
import { EntityDTO } from '@mikro-orm/core';
import { IEvent } from '@nestjs/cqrs';

export class UserSavedEvent implements IEvent {
  public constructor(
    public readonly user: EntityDTO<User>,
    public readonly oldState: EntityDTO<User> | null,
  ) {}
}
