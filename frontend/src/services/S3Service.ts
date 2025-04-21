import { DeleteImageDto } from "../models/Image";
import axiosInstance from "./axiosInstance";

const API_URL = "/s3";

class S3Service {
  async upload(file: File): Promise<{ fileName: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to upload images");
    }
  }

  async delete(deleteImageDto: DeleteImageDto) {
    try {
      const response = await axiosInstance.delete(API_URL, {
        data: deleteImageDto,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete image");
    }
  }
}

export default new S3Service();
