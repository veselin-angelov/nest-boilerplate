import { EntityDTO, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { omit } from 'lodash';
import { SaveUserCommand } from '@app/users/commands/save-user.command';
import { UserRepository } from '@app/users/repositories';
import { User } from '@app/users/entities';
import { hashSync } from 'bcrypt';
import { UserSavedEvent } from '@app/users/events';

@CommandHandler(SaveUserCommand)
export class SaveUserHandler implements ICommandHandler<SaveUserCommand> {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}

  public async execute({ userDto, id }: SaveUserCommand): Promise<User> {
    const user = await this.findOneOrCreate(id);
    const oldUser: EntityDTO<User> = wrap(user).toPOJO();

    if (!!userDto.password) {
      userDto.password = hashSync(userDto.password, 10);
    }

    wrap(user).assign(
      {
        ...omit(userDto, ['id']),
      },
      {
        em: this.em,
      },
    );

    await this.em.persistAndFlush(user);

    this.eventBus.publish(
      new UserSavedEvent(wrap(user).toPOJO(), !!id ? oldUser : null),
    );

    return user;
  }

  private async findOneOrCreate(id?: string): Promise<User> {
    if (!id) {
      return new User();
    }

    return await this.userRepository.findOneOrFail({
      id,
    });
  }
}
