import { IQuery } from '@nestjs/cqrs';

export class UserQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
