import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';

interface ProductExpertiseCreationAttributes {
  product_id: number;
  area: string;
  description: string;
}

@Table({
  tableName: 'product_expertise',
  defaultScope: {
    attributes: { exclude: ['product_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductExpertise extends Model<
  ProductExpertise,
  ProductExpertiseCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  declare product_id: number;

  @AllowNull(false)
  @Column
  declare area: string;

  @AllowNull(false)
  @Column
  declare description: string;

  @BelongsTo(() => Product)
  declare product: Product;
}
