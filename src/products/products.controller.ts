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
import { UserRoles } from 'src/libs/utils/constants/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListOfUserDto } from './dto/list-of-product.dto';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create Product' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.productsService.create(dto);
  }

  @ApiOperation({ summary: 'Get List of Products' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: ListOfUserDto) {
    return await this.productsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get Product by ID' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  // @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Product' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete Product' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
