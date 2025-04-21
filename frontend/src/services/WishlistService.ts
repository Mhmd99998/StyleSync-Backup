import { ProductDto } from "../models/Product";
import axiosInstance from "./axiosInstance";
import ProductService from "./ProductService";

export interface WishlistItemDto {
  wishlistItemId: string;
  userId: string;
  productId: string;
  productName: string;
  addedAt: string;
}

class WishlistService {
  async getWishlistByUserId(userId: string) {
    try {
      const products: ProductDto[] = [];
      const response = await axiosInstance.get(`users/${userId}/wishlist`);
      const items: WishlistItemDto[] = response.data;
      for (const item of items) {
        const product = await ProductService.getProductById(item.productId);
        console.log(product);
        products.push(product);
      }

      return products;
    } catch (error) {
      throw new Error(`Failed to retrieve wishlist for user: ${userId}`);
    }
  }

  async addItemToWishlist(userId: string, productId: string) {
    try {
      const response = await axiosInstance.post(
        `users/${userId}/wishlist/items`,
        { productId }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to add item to wishlist");
    }
  }

  async deleteItemFromWishlist(userId: string, productId: string) {
    try {
      const response = await axiosInstance.delete(
        `users/${userId}/wishlist/items`,
        {
          data: { productId },
        }
      );
      return response.data;
      return;
    } catch (error) {
      throw new Error("Failed to delete item from wishlist");
    }
  }
}

export default new WishlistService();
