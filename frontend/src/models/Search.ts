export interface IndexedVariantDto {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
}

export interface IndexedProductDto {
  id: string;
  name: string;
  description: string;
  isArchived: boolean;
  variants: IndexedVariantDto[];
  categories: {
    name: string;
  } [];
}
