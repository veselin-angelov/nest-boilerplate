import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bullmq';
import { DeleteUserCommand } from '@app/users/commands/delete-user.command';
import { UserRepository } from '@app/users/repositories';
import { InjectQueue } from '@nestjs/bullmq';
import { DeleteUserConsumer } from '@app/users/consumers';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  public constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue(DeleteUserConsumer.queueName) private readonly queue: Queue,
  ) {}

  public async execute({ id }: DeleteUserCommand): Promise<any> {
    const user = await this.userRepository.findOneOrFail({
      id,
    });

    await this.queue.add(DeleteUserConsumer.jobName, { userId: user.id });
  }
}
