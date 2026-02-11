import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductImageDto {
  @ApiProperty({ example: 'Product Overview Image' })
  @IsNotEmpty()
  @IsString()
  overview_image: string;

  @ApiProperty({ example: 'Product Service Image' })
  @IsNotEmpty()
  @IsString()
  service_image: string;

  @ApiProperty({ example: 'Product Right Sidebar Image 1' })
  @IsNotEmpty()
  @IsString()
  right_sidebar_image_1: string;

  @ApiProperty({ example: 'Product Right Sidebar Image 2' })
  @IsNotEmpty()
  @IsString()
  right_sidebar_image_2: string;
}

export class ProductBenefitDto {
  @ApiProperty({ example: 'Product benefit description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ProductServiceDetailDto {
  @ApiProperty({ example: 'Product service detail' })
  @IsNotEmpty()
  @IsString()
  detail: string;
}

export class ProductServiceDto {
  @ApiProperty({ example: 'Product service type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ type: () => ProductServiceDetailDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductServiceDetailDto)
  product_service_details?: ProductServiceDetailDto[];
}

export class ProductMethodologyDto {
  @ApiProperty({ example: 'Product methodology steps' })
  @IsNotEmpty()
  @IsString()
  steps: string;
}

export class ProductExpertiseDto {
  @ApiProperty({ example: 'Product expertise area' })
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty({ example: 'Product expertise description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Product description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Product contact us' })
  @IsNotEmpty()
  @IsString()
  contact_us: string;

  @ApiProperty({ type: () => ProductImageDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductImageDto)
  product_images: ProductImageDto;

  @ApiProperty({ type: () => ProductBenefitDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductBenefitDto)
  product_benefits?: ProductBenefitDto[];

  @ApiProperty({ type: () => ProductServiceDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductServiceDto)
  product_services?: ProductServiceDto[];

  @ApiProperty({ type: () => ProductMethodologyDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductMethodologyDto)
  product_methodologies?: ProductMethodologyDto[];

  @ApiProperty({ type: () => ProductExpertiseDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductExpertiseDto)
  product_expertise?: ProductExpertiseDto[];
}
