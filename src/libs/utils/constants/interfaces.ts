export interface ResponseData<T = unknown> {
  status: string;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
}

export interface JWTPayload {
  id: string;
  email?: string;
  role: string;
}

export interface RequestPayload extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}
