import {
  CategoryDto,
  CreateCategoryDto,
  CreateProductCategoryDto,
  ProductCategoryDto,
  UpdateCategoryDto,
} from "../models/Category";
import axiosInstance from "./axiosInstance";

const API_URL = "/categories";

class CategoryService {
  public async getAllCategories(): Promise<CategoryDto[]> {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve categories");
    }
  }

  public async getCategoryById(categoryId: string): Promise<CategoryDto> {
    try {
      const response = await axiosInstance.get(`${API_URL}/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve category");
    }
  }

  public async getCategoryByName(name: string): Promise<CategoryDto> {
    try {
      const response = await axiosInstance.get(`${API_URL}/query`, {
        params: name,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve category");
    }
  }

  public async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<CategoryDto> {
    try {
      const response = await axiosInstance.post(API_URL, createCategoryDto);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create category");
    }
  }

  public async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto
  ): Promise<ProductCategoryDto> {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/product`,
        createProductCategoryDto
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create product category");
    }
  }

  public async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryDto> {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${categoryId}`,
        updateCategoryDto
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update category");
    }
  }

  public async deleteCategory(categoryId: string) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete category");
    }
  }
}

export default new CategoryService();
