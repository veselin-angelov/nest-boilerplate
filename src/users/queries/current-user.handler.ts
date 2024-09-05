import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CurrentUserQuery } from '@app/users/queries/current-user.query';
import { User } from '@app/users/entities';

@QueryHandler(CurrentUserQuery)
export class CurrentUserHandler implements IQueryHandler<CurrentUserQuery> {
  public async execute({ user }: CurrentUserQuery): Promise<User> {
    return user;
  }
}
