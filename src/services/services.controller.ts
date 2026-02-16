import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/role.guard';
import { Roles } from 'src/libs/services/decorators/role.decorator';
import { UserRoles } from 'src/libs/utils/constants/enums';
import { ListOfServiceDto } from './dto/list-of-service.dto';

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

  @ApiOperation({ summary: 'Get all service' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listServices(@Query() query: ListOfServiceDto) {
    return await this.servicesService.listServices(query);
  }
}
