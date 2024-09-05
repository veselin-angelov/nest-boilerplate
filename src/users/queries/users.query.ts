import { IQuery } from '@nestjs/cqrs';
import { ListingQueryDto } from '@app/shared/dtos';

export class UsersQuery implements IQuery {
  public constructor(public readonly queryDto: ListingQueryDto) {}
}
