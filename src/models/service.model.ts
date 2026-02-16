import {
  AllowNull,
  AutoIncrement,
  Column,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ServiceCreationAttributes } from 'src/libs/utils/constants/interfaces';
import { ServiceImage } from './service-images.model';
import { ServiceSubService } from './service-sub-service.model';
import { ServiceApproach } from './service-approach.model';
import { ServiceAtc } from './service-atc.model';
import { ServiceBenefit } from './service-benefits.model';
import { ServiceConsulting } from './service-consulting.model';

@Table({
  tableName: 'services',
  paranoid: true,
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  },
})
export class Service extends Model<Service, ServiceCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Column
  declare description: string;

  @AllowNull(false)
  @Column
  declare contact_us: string;

  @HasOne(() => ServiceImage)
  declare service_images: ServiceImage;

  @HasMany(() => ServiceSubService)
  declare service_sub_services: ServiceSubService[];

  @HasMany(() => ServiceApproach)
  declare service_approaches: ServiceApproach[];

  @HasMany(() => ServiceAtc)
  declare service_atc: ServiceAtc[];

  @HasMany(() => ServiceBenefit)
  declare service_benefits: ServiceBenefit[];

  @HasMany(() => ServiceConsulting)
  declare service_consulting: ServiceConsulting[];
}
