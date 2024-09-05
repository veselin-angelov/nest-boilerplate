import { UserDto } from '@app/users/dtos';
import { ICommand } from '@nestjs/cqrs';

export class SaveUserCommand implements ICommand {
  constructor(
    public readonly userDto: UserDto,
    public readonly id?: string,
  ) {}
}
