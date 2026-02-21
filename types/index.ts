import { Product, Category, ServiceRequest, MeasurementRequest, ContactMessage, User } from "@prisma/client";

export type ProductWithCategory = Product & {
  category: Category;
};

export type ServiceRequestWithUser = ServiceRequest & {
  user?: User | null;
};

export type MeasurementRequestWithUser = MeasurementRequest & {
  user?: User | null;
};

export type ContactMessageWithUser = ContactMessage & {
  user?: User | null;
};

export interface ProductFilters {
  type?: "MARBLE" | "GRANITE";
  origin?: "EGYPTIAN" | "IMPORTED";
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

