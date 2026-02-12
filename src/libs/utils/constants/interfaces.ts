import { StatusType } from './enums';

export interface ResponseHandlerOptions<T = unknown> {
  status: StatusType;
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

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ProductCreationAttributes {
  name: string;
  description: string;
  contact_us: string;
}

export interface ProductServiceCreationAttributes {
  product_id: number;
  type: string;
}

export interface ProductServiceDetailCreationAttributes {
  product_service_id: number;
  detail: string;
}

export interface ProductMethodologyCreationAttributes {
  product_id: number;
  steps: string;
}

export interface ProductImageCreationAttributes {
  product_id: number;
  overview_image: string;
  service_image: string;
  right_sidebar_image_1: string;
  right_sidebar_image_2: string;
}

export interface ProductExpertiseCreationAttributes {
  product_id: number;
  area: string;
  description: string;
}

export interface ProductBenefitCreationAttributes {
  product_id: number;
  description: string;
}
