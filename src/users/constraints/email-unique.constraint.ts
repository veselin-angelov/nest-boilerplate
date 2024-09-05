import { UserRepository } from '@app/users/repositories';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserDto } from '@app/users/dtos';

@ValidatorConstraint({ name: 'emailUnique', async: true })
@Injectable()
export class EmailUniqueConstraint implements ValidatorConstraintInterface {
  public constructor(private readonly userRepository: UserRepository) {}

  public async validate(
    value: any,
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return true;
    }

    try {
      const user = await this.userRepository.findOneOrFail({
        email: value,
      });

      return user.id === (args.object as UserDto)?.id;
    } catch (e) {
      return true;
    }
  }

  defaultMessage(): string {
    return 'User with this email already exists';
  }
}
