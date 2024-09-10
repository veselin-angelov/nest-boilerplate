import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiCurrentUser,
  ApiUpdateCurrentUser,
  InjectUser,
} from '@app/users/decorators';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserQuery } from '@app/users/queries';
import { UpdateCurrentUserDto } from '@app/users/dtos';
import { SaveUserCommand } from '@app/users/commands';
import { User } from '@app/shared/entities/user/entities';

@ApiTags('Me')
@Controller('me')
export class MeController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiCurrentUser()
  @Get()
  public async index(@InjectUser() user: User) {
    return await this.queryBus.execute(new CurrentUserQuery(user));
  }

  @ApiUpdateCurrentUser()
  @Patch()
  public async update(
    @Body() dto: UpdateCurrentUserDto,
    @InjectUser() user: User,
  ) {
    return await this.commandBus.execute(new SaveUserCommand(dto, user.id));
  }
}
