import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { StatusType } from 'src/libs/utils/constants/enums';
import { Messages } from 'src/libs/utils/constants/messages';

@Injectable()
export class CommonService {
  constructor(private config: ConfigService) {}

  fileUpload(file: Express.Multer.File) {
    if (!file) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `File ${Messages.NOT_FOUND}`,
      });
    }

    const fileUrl = `${this.config.get('BASE_FILE_URL')}/${file.filename}`;

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: `File ${Messages.UPLOAD_SUCCESS}`,
      data: {
        fileName: file.filename,
        fileUrl,
      },
    });
  }
}
