import { FilterQuery } from '@mikro-orm/core';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQuery } from '@app/users/queries/users.query';
import { UserRepository } from '@app/users/repositories';
import { FiltersQueryBuilderService } from '@app/shared/filter/services';
import { UsersResultWithCountDto } from '@app/users/dtos';
import { User } from '@app/users/entities';
import { orderStringToObject } from '@app/shared/helpers';

@QueryHandler(UsersQuery)
export class UsersHandler implements IQueryHandler<UsersQuery> {
  public constructor(
    private readonly usersRepository: UserRepository,
    private readonly filterQueryBuilderService: FiltersQueryBuilderService,
  ) {}

  public async execute({
    queryDto,
  }: UsersQuery): Promise<UsersResultWithCountDto> {
    const filters: FilterQuery<User> = {
      ...(this.filterQueryBuilderService.getQuery(queryDto.filters) as any),
    };

    const [result, count] = await this.usersRepository.findAndCount(filters, {
      limit: queryDto.limit ?? 20,
      offset: queryDto.offset ?? 0,
      orderBy: queryDto.sort
        ? orderStringToObject(queryDto.sort, ['email', 'active', 'createdAt'])
        : { createdAt: 'desc', id: 'desc' },
    });

    return new UsersResultWithCountDto(result, count);
  }
}
