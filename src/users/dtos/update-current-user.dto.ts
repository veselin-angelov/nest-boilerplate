import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateCurrentUserDto {
  @ApiProperty({
    required: false,
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
  @MinLength(8)
  @IsString()
  @IsOptional()
  public password?: string;
}
