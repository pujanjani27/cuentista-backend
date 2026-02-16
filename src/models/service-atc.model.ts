import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ServiceAtcCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { Service } from './service.model';

@Table({
  tableName: 'service_atc',
  defaultScope: {
    attributes: { exclude: ['service_id', 'createdAt', 'updatedAt'] },
  },
})
export class ServiceAtc extends Model<
  ServiceAtc,
  ServiceAtcCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Service)
  @Column
  declare service_id: number;

  @AllowNull(false)
  @Column
  declare description: string;

  @BelongsTo(() => Service)
  declare service: Service;
}
