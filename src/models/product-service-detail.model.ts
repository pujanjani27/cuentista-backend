import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductService } from './product-service.model';
import { ProductServiceDetailCreationAttributes } from 'src/libs/utils/constants/interfaces';

@Table({
  tableName: 'product_service_details',
  defaultScope: {
    attributes: { exclude: ['product_service_id', 'createdAt', 'updatedAt'] },
  },
})
export class ProductServiceDetail extends Model<
  ProductServiceDetail,
  ProductServiceDetailCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => ProductService)
  @Column({ allowNull: false })
  declare product_service_id: number;

  @AllowNull(false)
  @Column
  declare detail: string;

  @BelongsTo(() => ProductService)
  declare product_service: ProductService;
}
