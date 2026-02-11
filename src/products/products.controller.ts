import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/role.guard';
import { Roles } from 'src/libs/services/decorators/role.decorator';
import { StatusType, UserRoles } from 'src/libs/utils/constants/enums';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { Messages } from 'src/libs/utils/constants/messages';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Create Product' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    await this.productsService.create(dto);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.CREATED,
      message: Messages.CREATED,
    });
  }
}
