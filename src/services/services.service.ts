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
import { ListOfServiceDto } from './dto/list-of-service.dto';
import { Op, Order } from 'sequelize';
import { UpdateServiceDto } from './dto/update-service.dto';

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

  async listServices(query: ListOfServiceDto) {
    const { page = 1, limit = 10, sortKey, sortValue, search } = query;

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where['name'] = {
        [Op.like]: `%${search}%`,
      };
    }

    let order: Order = [];
    if (sortKey && sortValue) {
      order = [[sortKey, sortValue]];
    }

    const listOfService = await this.serviceModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
      attributes: { exclude: ['description', 'contact_us'] },
    });

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      data: {
        services: listOfService.rows,
        meta: {
          current_page: page,
          limit,
          total_services: listOfService.count,
          total_pages: Math.ceil(listOfService.count / limit),
        },
      },
    });
  }

  async getServiceById(id: number) {
    const findService = await this.serviceModel.findByPk(id, {
      include: [
        { model: this.serviceImageModel },
        { model: this.serviceSubServiceModel },
        { model: this.serviceApproachModel },
        { model: this.serviceAtcModel },
        { model: this.serviceBenefitModel },
        { model: this.serviceConsultingModel },
      ],
    });

    if (!findService) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Service ${Messages.NOT_FOUND}`,
      });
    }

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      data: findService,
    });
  }

  async updateService(id: number, dto: UpdateServiceDto) {
    const findService = await this.serviceModel.findByPk(id);

    if (!findService) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Service ${Messages.NOT_FOUND}`,
      });
    }

    try {
      await this.sequelize.transaction(async (t) => {
        await this.serviceModel.update(
          {
            name: dto.name,
            description: dto.description,
            contact_us: dto.contact_us,
          },
          { where: { id }, transaction: t },
        );

        await this.serviceImageModel.destroy({
          where: { service_id: id },
          transaction: t,
        });

        await this.serviceSubServiceModel.destroy({
          where: { service_id: id },
        });

        await this.serviceApproachModel.destroy({
          where: { service_id: id },
        });

        await this.serviceAtcModel.destroy({
          where: { service_id: id },
        });

        await this.serviceBenefitModel.destroy({
          where: { service_id: id },
        });

        await this.serviceConsultingModel.destroy({
          where: { service_id: id },
        });

        await this.serviceImageModel.create(
          {
            service_id: id,
            ...dto.service_images,
          },
          { transaction: t },
        );

        if (dto.service_sub_services?.length) {
          await this.serviceSubServiceModel.bulkCreate(
            dto.service_sub_services.map((subService) => ({
              service_id: id,
              title: subService.title,
              description: subService.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_approaches?.length) {
          await this.serviceApproachModel.bulkCreate(
            dto.service_approaches.map((approach) => ({
              service_id: id,
              description: approach.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_atc?.length) {
          await this.serviceAtcModel.bulkCreate(
            dto.service_atc.map((atc) => ({
              service_id: id,
              description: atc.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_benefits?.length) {
          await this.serviceBenefitModel.bulkCreate(
            dto.service_benefits.map((benefit) => ({
              service_id: id,
              description: benefit.description,
            })),
            { transaction: t },
          );
        }

        if (dto.service_consulting?.length) {
          await this.serviceConsultingModel.bulkCreate(
            dto.service_consulting.map((consulting) => ({
              service_id: id,
              title: consulting.title,
              description: consulting.description,
            })),
            { transaction: t },
          );
        }
      });

      return responseHandler({
        status: StatusType.SUCCESS,
        statusCode: HttpStatus.OK,
        message: `Service ${Messages.UPDATED}`,
      });
    } catch {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${Messages.FAILED_TO_UPDATE} service`,
      });
    }
  }

  async deleteService(id: number) {
    const findService = await this.serviceModel.findByPk(id);

    if (!findService) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Service ${Messages.NOT_FOUND}`,
      });
    }

    await this.serviceModel.destroy({ where: { id } });

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: `Service ${Messages.DELETED}`,
    });
  }
}
