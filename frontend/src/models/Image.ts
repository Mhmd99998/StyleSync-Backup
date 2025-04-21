export interface ImageDto {
  imageId: string,
  variantId: string,
  imageUrl: string,
  isDefault: boolean, 
}

export interface UploadImageDto {
  variantId: string;
  imageUrl: string;
  isDefault?: boolean;
}

export interface DeleteImageDto {
  url: string;
}
