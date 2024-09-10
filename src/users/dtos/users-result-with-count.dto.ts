import { ApiProperty } from '@nestjs/swagger';
import { ResultWithCountDto } from '@app/shared/dtos';
import { User } from '@app/shared/entities/user/entities';

export class UsersResultWithCountDto extends ResultWithCountDto<User> {
  @ApiProperty({
    type: () => User,
    isArray: true,
  })
  public result: User[];
}
