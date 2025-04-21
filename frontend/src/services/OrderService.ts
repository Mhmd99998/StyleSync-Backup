import { AddItemToOrderDto, CreateOrderDto, OrderDto } from "../models/Order";
import axiosInstance from "./axiosInstance";

const API_URL = "/orders";

class OrderService {
  async getOrdersForUser(userId: string): Promise<OrderDto[]> {
    try {
      const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve orders for user");
    }
  }

  async getOrderById(orderId: string) {
    try {
      const response = await axiosInstance.get(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve order details");
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const response = await axiosInstance.post(API_URL, createOrderDto);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create new order");
    }
  }

  async addItemToOrder(orderId: string, addItemToOrderDto: AddItemToOrderDto) {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${orderId}/items`,
        addItemToOrderDto
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to add item to order");
    }
  }
}

export default new OrderService();
