import { User } from '@app/users/entities';
import { IQuery } from '@nestjs/cqrs';

export class CurrentUserQuery implements IQuery {
  public constructor(public readonly user: User) {}
}
