import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UniqueConstraintError, ValidationErrorItem } from 'sequelize';
import { StatusType } from '../../utils/constants/enums';
import { Messages } from '../../utils/constants/messages';
import { HttpAdapterHost } from '@nestjs/core';

type HttpExceptionResponse = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let exMessage: string | string[] = Messages.INTERNAL_SERVER_ERROR;

    /* ---------------- HttpException ---------------- */
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();

      const exResponse = exception.getResponse() as HttpExceptionResponse;

      if (exResponse?.message) {
        exMessage = exResponse.message;
      }
    }

    /* ---------------- Sequelize Unique Constraint ---------------- */
    if (exception instanceof UniqueConstraintError) {
      httpStatus = HttpStatus.CONFLICT;
      exMessage = exception.errors
        .map((err: ValidationErrorItem) => {
          const fieldName = err?.path?.replace(/_/g, ' ') ?? '';
          return `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } ${Messages.ALREADY_EXIST}`;
        })
        .join(', ');
    }

    /* ---------------- Not Found ---------------- */
    if (exception instanceof NotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
      exMessage = Messages.NOT_FOUND || 'Resource not found';
    }

    /* ---------------- Logging ---------------- */
    const logPayload = {
      method: request.method,
      url: request.url,
      statusCode: httpStatus,
      message: exMessage,
    };

    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        JSON.stringify(logPayload),
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(JSON.stringify(logPayload));
    }

    /* ---------------- Response ---------------- */
    const responseBody = {
      statusCode: httpStatus,
      status: StatusType.ERROR,
      message: exMessage,
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
