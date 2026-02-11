import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/role.guard';
import { Roles } from 'src/libs/services/decorators/role.decorator';
import { StatusType, UserRoles } from 'src/libs/utils/constants/enums';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { Messages } from 'src/libs/utils/constants/messages';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListOfUserDto } from './dto/list-of-product.dto';

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

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Get List of Products' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: ListOfUserDto) {
    const data = await this.productsService.findAll(query);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      data,
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Get Product by ID' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(+id);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      data,
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Update Product' })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(+id, updateProductDto);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.UPDATED,
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Delete Product' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.DELETED,
    });
  }
}
