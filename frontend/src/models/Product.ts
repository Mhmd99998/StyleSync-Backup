import { CategoryDto } from "./Category";
import { VariantDto } from "./Variant";

export interface ProductDto {
  productId: string;
  name: string;
  description: string;
  isArchived: boolean;
  variants: VariantDto[];
  categories: CategoryDto[];
}

export interface CreateProductDto {
  name: string;
  description: string;
  isArchived: boolean;
  variants?: VariantDto[];
  categories: CategoryDto[];
}

export interface UpdateProductDto {
  name: string;
  description: string;
  isArchived: boolean;
  categories: CategoryDto[];
}

export interface PaginatedProductResponse {
  totalProducts: number;
  products: ProductDto[];
}

export interface ProductFilterDto {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'createdAt'; 
  sortDirection?: 'asc' | 'desc';
  size?: string;
  color?: string;
  isArchived?: boolean;
}
