import { IQuery } from '@nestjs/cqrs';
import { User } from '@app/shared/entities/user/entities';

export class CurrentUserQuery implements IQuery {
  public constructor(public readonly user: User) {}
}
