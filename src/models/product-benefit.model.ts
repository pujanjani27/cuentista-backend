import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductBenefitCreationAttributes } from 'src/libs/utils/constants/interfaces';

@Table({
  tableName: 'product_benefits',
  defaultScope: {
    attributes: { exclude: ['product_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductBenefit extends Model<
  ProductBenefit,
  ProductBenefitCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  declare product_id: number;

  @AllowNull(false)
  @Column
  declare description: string;

  @BelongsTo(() => Product)
  declare product: Product;
}
