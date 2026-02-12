import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductMethodologyCreationAttributes } from 'src/libs/utils/constants/interfaces';

@Table({
  tableName: 'product_methodologies',
  defaultScope: {
    attributes: { exclude: ['product_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductMethodology extends Model<
  ProductMethodology,
  ProductMethodologyCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  declare product_id: number;

  @AllowNull(false)
  @Column
  declare steps: string;

  @BelongsTo(() => Product)
  declare product: Product;
}
