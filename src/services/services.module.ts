import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Service,
  ServiceApproach,
  ServiceAtc,
  ServiceBenefit,
  ServiceConsulting,
  ServiceImage,
  ServiceSubService,
} from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Service,
      ServiceImage,
      ServiceSubService,
      ServiceApproach,
      ServiceAtc,
      ServiceBenefit,
      ServiceConsulting,
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
