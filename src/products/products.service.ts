import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { Sequelize } from 'sequelize-typescript';
import {
  Product,
  ProductImage,
  ProductBenefit,
  ProductService,
  ProductServiceDetail,
  ProductMethodology,
  ProductExpertise,
} from 'src/models';
import { InjectModel } from '@nestjs/sequelize';
import { ListOfUserDto } from './dto/list-of-product.dto';
import { Op, Order } from 'sequelize';
import { UpdateProductDto } from './dto/update-product.dto';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { StatusType } from 'src/libs/utils/constants/enums';
import { Messages } from 'src/libs/utils/constants/messages';

@Injectable()
export class ProductsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(ProductImage) private productImageModel: typeof ProductImage,
    @InjectModel(ProductBenefit)
    private productBenefitModel: typeof ProductBenefit,
    @InjectModel(ProductService)
    private productServiceModel: typeof ProductService,
    @InjectModel(ProductServiceDetail)
    private productServiceDetailModel: typeof ProductServiceDetail,
    @InjectModel(ProductMethodology)
    private productMethodologyModel: typeof ProductMethodology,
    @InjectModel(ProductExpertise)
    private productExpertiseModel: typeof ProductExpertise,
  ) {}

  async create(dto: CreateProductDto) {
    try {
      await this.sequelize.transaction(async (t) => {
        // create product
        const product = await this.productModel.create(
          {
            name: dto.name,
            description: dto.description,
            contact_us: dto.contact_us,
          },
          { transaction: t },
        );

        // product images
        await this.productImageModel.create(
          {
            product_id: product.id,
            ...dto.product_images,
          },
          { transaction: t },
        );

        // product benefits
        if (dto.product_benefits?.length) {
          await this.productBenefitModel.bulkCreate(
            dto.product_benefits.map((benefit) => ({
              product_id: product.id,
              description: benefit.description,
            })),
            { transaction: t },
          );
        }

        // product services + details
        if (dto.product_services?.length) {
          const createdServices = await this.productServiceModel.bulkCreate(
            dto.product_services.map((service) => ({
              product_id: product.id,
              type: service.type,
            })),
            { transaction: t },
          );

          const serviceDetails = dto.product_services.flatMap(
            (service, index) =>
              service.product_service_details?.map((detail) => ({
                product_service_id: +createdServices[index].id,
                detail: detail.detail,
              })) ?? [],
          );

          if (serviceDetails.length) {
            await this.productServiceDetailModel.bulkCreate(serviceDetails, {
              transaction: t,
            });
          }
        }

        // product methodologies
        if (dto.product_methodologies?.length) {
          await this.productMethodologyModel.bulkCreate(
            dto.product_methodologies.map((methodology) => ({
              product_id: product.id,
              steps: methodology.steps,
            })),
            { transaction: t },
          );
        }

        // product expertise
        if (dto.product_expertise?.length) {
          await this.productExpertiseModel.bulkCreate(
            dto.product_expertise.map((expertise) => ({
              product_id: product.id,
              area: expertise.area,
              description: expertise.description,
            })),
            { transaction: t },
          );
        }
      });

      return responseHandler({
        status: StatusType.SUCCESS,
        statusCode: HttpStatus.CREATED,
        message: `Product ${Messages.CREATED}`,
      });
    } catch {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${Messages.FAILED_TO_CREATE} product`,
      });
    }
  }

  async findAll(query: ListOfUserDto) {
    const { page = 1, limit = 10, sortValue, sortKey, search } = query;

    const offset = (page - 1) * limit;

    const where = { is_active: true };

    if (search) {
      where['name'] = {
        [Op.like]: `%${search}%`,
      };
    }

    let order: Order = [];
    if (sortKey && sortValue) {
      order = [[sortKey, sortValue]];
    }

    const products = await this.productModel.findAndCountAll({
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
        products: products.rows,
        meta: {
          currentPage: page,
          limit,
          total_products: products.count,
          total_pages: Math.ceil(products.count / limit),
        },
      },
    });
  }

  async findOne(id: number) {
    const findProduct = await this.productModel.findOne({
      where: { id, is_active: true },
      include: [
        { model: this.productImageModel },
        { model: this.productBenefitModel },
        {
          model: this.productServiceModel,
          include: [{ model: this.productServiceDetailModel }],
        },
        { model: this.productMethodologyModel },
        { model: this.productExpertiseModel },
      ],
    });

    if (!findProduct) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product ${Messages.NOT_FOUND}`,
      });
    }

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      data: findProduct,
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const findProduct = await this.productModel.findOne({
      where: { id, is_active: true },
    });

    if (!findProduct) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product ${Messages.NOT_FOUND}`,
      });
    }

    try {
      await this.sequelize.transaction(async (t) => {
        // update product
        await this.productModel.update(
          {
            name: dto.name,
            description: dto.description,
            contact_us: dto.contact_us,
          },
          {
            where: { id },
            transaction: t,
          },
        );

        // delete all the child records
        await this.productImageModel.destroy({
          where: { product_id: id },
          transaction: t,
        });

        await this.productBenefitModel.destroy({
          where: { product_id: id },
          transaction: t,
        });

        const services = await this.productServiceModel.findAll({
          where: { product_id: id },
          attributes: ['id'],
          raw: true,
          transaction: t,
        });

        const serviceIds = services.map((s) => +s.id);

        if (serviceIds.length)
          await this.productServiceDetailModel.destroy({
            where: {
              product_service_id: {
                [Op.in]: serviceIds,
              },
            },
            transaction: t,
          });

        await this.productServiceModel.destroy({
          where: { product_id: id },
          transaction: t,
        });

        await this.productMethodologyModel.destroy({
          where: { product_id: id },
          transaction: t,
        });

        await this.productExpertiseModel.destroy({
          where: { product_id: id },
          transaction: t,
        });

        // product images
        await this.productImageModel.create(
          {
            product_id: id,
            ...dto.product_images,
          },
          { transaction: t },
        );

        // product benefits
        if (dto.product_benefits?.length) {
          await this.productBenefitModel.bulkCreate(
            dto.product_benefits.map((benefit) => ({
              product_id: id,
              description: benefit.description,
            })),
            { transaction: t },
          );
        }

        // product services + details
        if (dto.product_services?.length) {
          const createdServices = await this.productServiceModel.bulkCreate(
            dto.product_services.map((service) => ({
              product_id: id,
              type: service.type,
            })),
            { transaction: t },
          );

          const serviceDetails = dto.product_services.flatMap(
            (service, index) =>
              service.product_service_details?.map((detail) => ({
                product_service_id: +createdServices[index].id,
                detail: detail.detail,
              })) ?? [],
          );

          if (serviceDetails.length) {
            await this.productServiceDetailModel.bulkCreate(serviceDetails, {
              transaction: t,
            });
          }
        }

        // product methodologies
        if (dto.product_methodologies) {
          await this.productMethodologyModel.bulkCreate(
            dto.product_methodologies.map((methodology) => ({
              product_id: id,
              steps: methodology.steps,
            })),
            { transaction: t },
          );
        }

        // product expertise
        if (dto.product_expertise) {
          await this.productExpertiseModel.bulkCreate(
            dto.product_expertise.map((expertise) => ({
              product_id: id,
              area: expertise.area,
              description: expertise.description,
            })),
            { transaction: t },
          );
        }
      });

      return responseHandler({
        status: StatusType.SUCCESS,
        statusCode: HttpStatus.OK,
        message: `Product ${Messages.UPDATED}`,
      });
    } catch {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${Messages.FAILED_TO_UPDATE} product`,
      });
    }
  }

  async remove(id: number) {
    const findProduct = await this.productModel.findOne({
      where: { id, is_active: true },
    });

    if (!findProduct) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product ${Messages.NOT_FOUND}`,
      });
    }

    await this.productModel.update({ is_active: false }, { where: { id } });

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: `Product ${Messages.DELETED}`,
    });
  }
}
