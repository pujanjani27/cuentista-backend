import { HttpStatus } from '@nestjs/common';
import { ResponseHandlerOptions } from '../utils/constants/interfaces';
import { StatusType } from '../utils/constants/enums';

export function responseHandler<T>({
  status,
  statusCode,
  message,
  data,
  error,
}: {
  status: StatusType;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
}): ResponseHandlerOptions<T> {
  return {
    status,
    statusCode: statusCode || HttpStatus.OK,
    message,
    data: data || undefined,
    error: error || undefined,
  };
}
