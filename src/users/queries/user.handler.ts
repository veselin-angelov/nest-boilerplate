import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQuery } from '@app/users/queries/user.query';
import { UserRepository } from '@app/shared/entities/user/repositories';

@QueryHandler(UserQuery)
export class UserHandler implements IQueryHandler<UserQuery> {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute({ id }: UserQuery): Promise<any> {
    return await this.userRepository.findOneOrFail({
      id,
    });
  }
}
