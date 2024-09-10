import { Entity, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { CustomBaseEntity } from '@app/shared/entities';
import { UserRepository } from '@app/shared/entities/user/repositories';

@Entity({
  repository: () => UserRepository,
})
export class User extends CustomBaseEntity {
  @ApiProperty({
    nullable: false,
  })
  @Property({
    unique: true,
  })
  public email: string;

  @ApiProperty({
    nullable: false,
  })
  @Property({
    hidden: true,
  })
  public password!: string;

  @ApiProperty({
    type: 'boolean',
    nullable: false,
  })
  @Property({
    default: true,
    columnType: 'boolean',
  })
  public active: boolean = true;

  // @ApiProperty({
  //   readOnly: true,
  //   nullable: true,
  // })
  // @Transform(({ value }) => (value && value.rules ? value.rules : null))
  // @Property({
  //   persist: false,
  // })
  // public ability?: PureAbility;
}
