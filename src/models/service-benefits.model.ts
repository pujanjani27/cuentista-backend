import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ServiceBenefitCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { Service } from './service.model';

@Table({ tableName: 'service_benefits' })
export class ServiceBenefit extends Model<
  ServiceBenefit,
  ServiceBenefitCreationAttributes
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
