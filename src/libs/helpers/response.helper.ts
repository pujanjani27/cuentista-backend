import { ResponseData } from '../utils/constants/interfaces';

export function responseHandler<T>({
  status,
  statusCode,
  message,
  data,
  error,
}: {
  status: string;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
}): ResponseData<T> {
  return { status, statusCode, message, data, error };
}
