import { CreateVariantDto, UpdateVariantDto, VariantDto } from "../models/Variant";
import axiosInstance from "./axiosInstance";

const API_URL = "/variants";

class VariantService {
  async getVariantById(variantId: string): Promise<VariantDto> {
    try {
      const response = await axiosInstance.get(`${API_URL}/${variantId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to retrieve variant: ${variantId}`, error);
      throw new Error(`Failed to retrieve product variant: ${variantId}`);
    }
  }

  async createVariant(variant: CreateVariantDto): Promise<VariantDto> {
    try {
      const response = await axiosInstance.post(API_URL, variant);
      return response.data;
    } catch (error) {
      console.error("Failed to create product variant", error);
      throw new Error("Failed to create new product variant");
    }
  }

  async updateVariant(
    variantId: string,
    updatedVariant: UpdateVariantDto
  ): Promise<UpdateVariantDto> {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${variantId}`,
        updatedVariant
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update product variant", error);
      throw new Error(`Failed to update product variant: ${variantId}`);
    }
  }

  async deleteVariant(variantId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_URL}/${variantId}`);
    } catch (error) {
      console.error("Failed to delete product variant", error);
      throw new Error(`Failed to delete product variant ${variantId}`);
    }
  }
}

export default new VariantService();
