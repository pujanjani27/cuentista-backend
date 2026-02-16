import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/role.guard';
import { Roles } from 'src/libs/services/decorators/role.decorator';
import { UserRoles } from 'src/libs/utils/constants/enums';
import { ListOfServiceDto } from './dto/list-of-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Create service' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createService(@Body() dto: CreateServiceDto) {
    return await this.servicesService.create(dto);
  }

  @ApiOperation({ summary: 'List of service' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listServices(@Query() query: ListOfServiceDto) {
    return await this.servicesService.listServices(query);
  }

  @ApiOperation({ summary: 'Get service by id' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return await this.servicesService.getServiceById(+id);
  }

  @ApiOperation({ summary: 'Update service' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return await this.servicesService.updateService(+id, dto);
  }

  @ApiOperation({ summary: 'Delete service' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return await this.servicesService.deleteService(+id);
  }
}
