import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';

interface ProductImageCreationAttributes {
  product_id: number;
  overview_image: string;
  service_image: string;
  right_sidebar_image_1: string;
  right_sidebar_image_2: string;
}

@Table({
  tableName: 'product_images',
  defaultScope: {
    attributes: { exclude: ['product_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductImage extends Model<
  ProductImage,
  ProductImageCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  declare product_id: number;

  @AllowNull(false)
  @Column
  declare overview_image: string;

  @AllowNull(false)
  @Column
  declare service_image: string;

  @AllowNull(false)
  @Column
  declare right_sidebar_image_1: string;

  @AllowNull(false)
  @Column
  declare right_sidebar_image_2: string;

  @BelongsTo(() => Product)
  declare product: Product;
}
