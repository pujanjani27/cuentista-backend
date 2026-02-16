import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ServiceApproachCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { Service } from './service.model';

@Table({
  tableName: 'service_approaches',
  defaultScope: {
    attributes: { exclude: ['service_id', 'createdAt', 'updatedAt'] },
  },
})
export class ServiceApproach extends Model<
  ServiceApproach,
  ServiceApproachCreationAttributes
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
