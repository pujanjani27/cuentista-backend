import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ProductImage } from './product-image.model';
import { ProductMethodology } from './product-methodology.model';
import { ProductBenefit } from './product-benefit.model';
import { ProductService } from './product-service.model';
import { ProductExpertise } from './product-expertise.model';
import { ProductCreationAttributes } from 'src/libs/utils/constants/interfaces';

@Table({
  tableName: 'products',
  defaultScope: {
    attributes: { exclude: ['is_active', 'createdAt', 'updatedAt'] },
  },
})
export class Product extends Model<Product, ProductCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Column
  declare description: string;

  @AllowNull(false)
  @Column
  declare contact_us: string;

  @AllowNull(false)
  @Default(true)
  @Column
  declare is_active: boolean;

  @HasOne(() => ProductImage)
  declare product_images: ProductImage;

  @HasMany(() => ProductBenefit)
  declare product_benefits: ProductBenefit[];

  @HasMany(() => ProductService)
  declare product_services: ProductService[];

  @HasMany(() => ProductMethodology)
  declare product_methodologies: ProductMethodology[];

  @HasMany(() => ProductExpertise)
  declare product_expertise: ProductExpertise[];
}
