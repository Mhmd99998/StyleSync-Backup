import { ImageDto, UploadImageDto } from "../models/Image";
import axiosInstance from "./axiosInstance";
import S3Service from "./S3Service";

const API_URL = "/images";

class ImageService {
  async getImageById(imageId: string): Promise<ImageDto> {
    try {
      const response = await axiosInstance.get(`${API_URL}/${imageId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve image: ${imageId}`);
    }
  }

  async uploadImage(variantId: string, file: File): Promise<ImageDto> {
    try {
      const { fileUrl } = await S3Service.upload(file);
      const imageDto: UploadImageDto = {
        variantId: variantId,
        imageUrl: fileUrl,
        isDefault: false,
      };

      const response = await axiosInstance.post(API_URL, imageDto);
      return response.data;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  }

  async uploadImages(variantId: string, files: File[]): Promise<string[]> {
    try {
      const uploadedImages = [];

      for (const file of files) {
        const { fileUrl } = await S3Service.upload(file);
        const imageDto: UploadImageDto = {
          variantId: variantId,
          imageUrl: fileUrl,
          isDefault: false,
        };

        const response: ImageDto = await axiosInstance.post(API_URL, imageDto);
        uploadedImages.push(response.imageId);
      }

      return uploadedImages;
    } catch (error) {
      throw new Error("Failed to upload images");
    }
  }

  async deleteImage(imageId: string) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${imageId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete image: ${imageId}`);
    }
  }

  async deleteImages(imageIds: string[]) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/bulk`, {
        data: imageIds,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete images");
    }
  }

  async setImageAsDefault(variantId: string, imageId: string) {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${variantId}/set-default/${imageId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to set image as default");
    }
  }
}

export default new ImageService();
