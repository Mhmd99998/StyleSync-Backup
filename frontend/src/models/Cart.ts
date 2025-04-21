export interface AddItemToCartDto {
  variantId: string;
  quantity: number;
}

export interface CartItemDto {
  cartItemId: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface CartDto {
  cartId: string;
  userId: string;
  createdAt: string;
  items: CartItemDto[];
}
