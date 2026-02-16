import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ServiceImageDto {
  @ApiProperty({ example: 'overview_image.jpg' })
  @IsNotEmpty()
  @IsString()
  overview_image: string;

  @ApiProperty({ example: 'service_image.jpg' })
  @IsNotEmpty()
  @IsString()
  service_image: string;

  @ApiProperty({ example: 'right_sidebar_image_1.jpg' })
  @IsNotEmpty()
  @IsString()
  right_sidebar_image_1: string;

  @ApiProperty({ example: 'right_sidebar_image_2.jpg' })
  @IsNotEmpty()
  @IsString()
  right_sidebar_image_2: string;
}

export class ServiceSubServiceDto {
  @ApiProperty({ example: 'Sub service title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Sub service description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ServiceApproachDto {
  @ApiProperty({ example: 'service approach description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ServiceAtcDto {
  @ApiProperty({ example: 'Service Atc description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ServiceBenefitDto {
  @ApiProperty({ example: 'Service benefit description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ServiceConsultingDto {
  @ApiProperty({ example: 'Service consulting title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Service consulting description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateServiceDto {
  @ApiProperty({ example: 'Service name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Service description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Service contact us' })
  @IsNotEmpty()
  @IsString()
  contact_us: string;

  @ApiProperty({ type: () => ServiceImageDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceImageDto)
  service_images: ServiceImageDto;

  @ApiProperty({ type: () => ServiceSubServiceDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceSubServiceDto)
  service_sub_services?: ServiceSubServiceDto[];

  @ApiProperty({ type: () => ServiceApproachDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceApproachDto)
  service_approaches?: ServiceApproachDto[];

  @ApiProperty({ type: () => ServiceAtcDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceAtcDto)
  service_atc?: ServiceAtcDto[];

  @ApiProperty({ type: () => ServiceBenefitDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceBenefitDto)
  service_benefits?: ServiceBenefitDto[];

  @ApiProperty({ type: () => ServiceConsultingDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceConsultingDto)
  service_consulting?: ServiceConsultingDto[];
}
