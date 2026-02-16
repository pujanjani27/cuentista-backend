import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ServiceImageCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { Service } from './service.model';

@Table({
  tableName: 'service_images',
  defaultScope: {
    attributes: { exclude: ['service_id', 'createdAt', 'updatedAt'] },
  },
})
export class ServiceImage extends Model<
  ServiceImage,
  ServiceImageCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Service)
  @Column
  declare service_id: number;

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

  @BelongsTo(() => Service)
  declare service: Service;
}
