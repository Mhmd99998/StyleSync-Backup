import axios from "axios";
import { IndexedProductDto } from "../models/Search";
import axiosInstance from "./axiosInstance";

const API_URL = "/search";

class SearchService {
  public async search(q: string): Promise<IndexedProductDto[]> {
    try {
      const response = await axios.get(`https://localhost:5000/api/search?q=${q}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to find products");
    }
  }

  // async searchProduct(q: string): Promise<IndexedProductDto[]> {
  //   try {
  //     const response: IndexedProductDto[] = await axiosInstance.get(API_URL, { params: q });
  //     return response;
  //   } catch (error) {
  //     throw new Error("Failed to find products");
  //   }
  // }
}

export default new SearchService();
