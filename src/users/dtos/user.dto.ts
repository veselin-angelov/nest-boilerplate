import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { EmailUniqueConstraint } from '@app/users/constraints';

export class UserDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  public id?: string;

  @ApiProperty({
    required: false,
  })
  @Validate(EmailUniqueConstraint)
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((object, value) => !object.id || !!value)
  public email?: string;

  @ApiProperty({
    required: false,
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => !object.id || !!value)
  public password?: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  public active?: boolean;
}
