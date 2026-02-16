import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Product,
  ProductImage,
  ProductBenefit,
  ProductService,
  ProductServiceDetail,
  ProductMethodology,
  ProductExpertise,
} from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      ProductImage,
      ProductBenefit,
      ProductService,
      ProductServiceDetail,
      ProductMethodology,
      ProductExpertise,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
