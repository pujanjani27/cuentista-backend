import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListOfUserDto {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    example: 'desc',
    type: 'string',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortValue?: 'asc' | 'desc';

  @ApiProperty({
    example: 'id',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'name'])
  sortKey?: string;

  @ApiProperty({
    example: '',
    description: 'Search product name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
