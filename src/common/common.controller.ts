import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/libs/services/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload } from 'src/libs/helpers/upload-file.helper';
import { UserRoles } from 'src/libs/utils/constants/enums';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/role.guard';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @UseInterceptors(FileInterceptor('file', upload))
  @HttpCode(HttpStatus.OK)
  @Post('/fileUpload')
  fileUpload(@UploadedFile() file: Express.Multer.File) {
    return this.commonService.fileUpload(file);
  }
}
