import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductServiceDetail } from './product-service-detail.model';

interface ProductServiceCreationAttributes {
  product_id: number;
  type: string;
}

@Table({
  tableName: 'product_services',
  defaultScope: {
    attributes: { exclude: ['product_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductService extends Model<
  ProductService,
  ProductServiceCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  declare product_id: number;

  @AllowNull(false)
  @Column
  declare type: string;

  @BelongsTo(() => Product)
  declare product: Product;

  @HasMany(() => ProductServiceDetail, { onDelete: 'CASCADE' })
  declare product_service_details: ProductServiceDetail[];
}
