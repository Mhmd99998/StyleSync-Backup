export interface CategoryDto {
  categoryId: string;
  name: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface CreateProductCategoryDto {
  categoryId: string;
  productId: string;
}

export interface ProductCategoryDto {
  categoryId: string;
  productId: string;
}
