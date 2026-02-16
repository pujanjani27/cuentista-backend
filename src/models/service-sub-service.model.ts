import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ServiceSubServiceCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { Service } from './service.model';

@Table({ tableName: 'service_sub_services' })
export class ServiceSubService extends Model<
  ServiceSubService,
  ServiceSubServiceCreationAttributes
> {
  @AllowNull(false)
  @ForeignKey(() => Service)
  @Column
  declare service_id: number;

  @AllowNull(false)
  @Column
  declare title: string;

  @AllowNull(false)
  @Column
  declare description: string;

  @BelongsTo(() => Service)
  declare service: Service;
}
