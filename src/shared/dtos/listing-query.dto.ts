import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  Max,
  Validate,
  ValidateNested,
} from 'class-validator';
import {
  FilterConditionDto,
  FiltersDto,
  GroupedConditionsDto,
} from '@app/shared/filter/dtos';
import { TransformFilters } from '@app/shared/filter/decorators';
import { Transform } from 'class-transformer';
import { SortPairConstraint } from '@app/shared/constraints';

export class ListingQueryDto {
  @ApiProperty({
    required: false,
  })
  @Max(300)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  public limit?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  public offset?: number;

  @ApiProperty({
    type: () => FiltersDto,
    description: 'A json string with the filters',
  })
  @TransformFilters()
  @ValidateNested()
  @IsOptional()
  public filters: (FilterConditionDto | GroupedConditionsDto)[] = [];

  @Validate(SortPairConstraint)
  @ApiProperty({
    required: false,
  })
  @IsArray()
  @IsOptional()
  public sort?: string[];
}
