import { AddItemToCartDto, CartDto } from "../models/Cart";
import axiosInstance from "./axiosInstance";

class CartService {
  async getCartForUser(userId: string): Promise<CartDto> {
    try {
      const response = await axiosInstance.get(`/users/${userId}/cart`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve cart for user: ${userId}`);
    }
  }

  async createCart(userId: string) {
    try {
      const response = await axiosInstance.post(`/users/${userId}/cart`, {
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create cart for user: ${userId}`);
    }
  }

  async addItemToCart(userId: string, addItemToCartDto: AddItemToCartDto) {
    try {
      const response = await axiosInstance.post(
        `/users/${userId}/cart/items`,
        addItemToCartDto
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  }

  async removeCartItem(userId: string, cartItemId: string) {
    try {
      const response = await axiosInstance.delete(`/users/${userId}/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to remove cart item ${cartItemId}`);
    }
  }

  async clearCart(userId: string) {
    try {
      const response = await axiosInstance.delete(`/users/${userId}/cart`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to clear cart for user: ${userId}`);
    }
  }
}

export default new CartService();
