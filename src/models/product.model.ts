import {
  AllowNull,
  AutoIncrement,
  Column,
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

interface ProductCreationAttributes {
  name: string;
  description: string;
  contact_us: string;
}

@Table({
  tableName: 'products',
  defaultScope: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
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

  @HasOne(() => ProductImage, { onDelete: 'CASCADE', hooks: true })
  declare product_images: ProductImage;

  @HasMany(() => ProductBenefit, { onDelete: 'CASCADE' })
  declare product_benefits: ProductBenefit[];

  @HasMany(() => ProductService, { onDelete: 'CASCADE' })
  declare product_services: ProductService[];

  @HasMany(() => ProductMethodology, { onDelete: 'CASCADE' })
  declare product_methodologies: ProductMethodology[];

  @HasMany(() => ProductExpertise, { onDelete: 'CASCADE' })
  declare product_expertise: ProductExpertise[];
}
