import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { omit } from 'lodash';
import {
  ApiDeleteUser,
  ApiSaveUser,
  ApiUser,
  ApiUsers,
} from '@app/users/decorators';
import { UserQuery, UsersQuery } from '@app/users/queries';
import { User } from '@app/users/entities';
import { UserDto, UsersResultWithCountDto } from '@app/users/dtos';
import { DeleteUserCommand, SaveUserCommand } from '@app/users/commands';
import { ListingQueryDto, MessageResponseDto } from '@app/shared/dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiUsers()
  @Get()
  public async index(
    @Query() query: ListingQueryDto,
  ): Promise<UsersResultWithCountDto> {
    return await this.queryBus.execute(new UsersQuery(query));
  }

  @ApiUser()
  @Get(':id')
  public async single(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.queryBus.execute(new UserQuery(id));
  }

  @ApiSaveUser()
  @Post()
  public async create(@Body() body: UserDto): Promise<User> {
    return await this.commandBus.execute(new SaveUserCommand(body));
  }

  @ApiSaveUser(true)
  @Patch('/:id')
  public async update(
    @Body() body: UserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return await this.commandBus.execute(
      new SaveUserCommand(omit(body, ['username']), id),
    );
  }

  @ApiDeleteUser()
  @Delete('/:id')
  public async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponseDto> {
    await this.commandBus.execute(new DeleteUserCommand(id));

    return new MessageResponseDto('User was sent for deletion!');
  }
}
