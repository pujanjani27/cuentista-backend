import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  Service,
  ServiceApproach,
  ServiceAtc,
  ServiceBenefit,
  ServiceConsulting,
  ServiceImage,
  ServiceSubService,
} from 'src/models';
import { Sequelize } from 'sequelize-typescript';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { StatusType } from 'src/libs/utils/constants/enums';
import { Messages } from 'src/libs/utils/constants/messages';

@Injectable()
export class ServicesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Service) private serviceModel: typeof Service,
    @InjectModel(ServiceImage) private serviceImageModel: typeof ServiceImage,
    @InjectModel(ServiceSubService)
    private serviceSubServiceModel: typeof ServiceSubService,
    @InjectModel(ServiceApproach)
    private serviceApproachModel: typeof ServiceApproach,
    @InjectModel(ServiceAtc) private serviceAtcModel: typeof ServiceAtc,
    @InjectModel(ServiceBenefit)
    private serviceBenefitModel: typeof ServiceBenefit,
    @InjectModel(ServiceConsulting)
    private serviceConsultingModel: typeof ServiceConsulting,
  ) {}

  async create(dto: CreateServiceDto) {
    try {
      await this.sequelize.transaction(async (t) => {
        const createdService = await this.serviceModel.create(
          {
            name: dto.name,
            description: dto.description,
            contact_us: dto.contact_us,
          },
          { transaction: t },
        );

        await this.serviceImageModel.create(
          {
            service_id: createdService.id,
            ...dto.service_images,
          },
          { transaction: t },
        );

        if (dto.service_sub_services?.length) {
          await this.serviceSubServiceModel.bulkCreate(
            dto.service_sub_services.map((subService) => ({
              service_id: createdService.id,
              title: subService.title,
              description: subService.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_approaches?.length) {
          await this.serviceApproachModel.bulkCreate(
            dto.service_approaches.map((approach) => ({
              service_id: createdService.id,
              description: approach.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_atc?.length) {
          await this.serviceAtcModel.bulkCreate(
            dto.service_atc.map((atc) => ({
              service_id: createdService.id,
              description: atc.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_benefits?.length) {
          await this.serviceBenefitModel.bulkCreate(
            dto.service_benefits.map((benefit) => ({
              service_id: createdService.id,
              description: benefit.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_consulting?.length) {
          await this.serviceConsultingModel.bulkCreate(
            dto.service_consulting.map((consulting) => ({
              service_id: createdService.id,
              title: consulting.title,
              description: consulting.description,
            })),
            { transaction: t },
          );
        }
      });

      return responseHandler({
        status: StatusType.SUCCESS,
        statusCode: HttpStatus.CREATED,
        message: `Service ${Messages.CREATED}`,
      });
    } catch {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${Messages.FAILED_TO_CREATE} service`,
      });
    }
  }
}
