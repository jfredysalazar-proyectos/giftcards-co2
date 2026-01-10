// Cloudinary configuration for image uploads
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload an image to Cloudinary
 * @param buffer - Image buffer
 * @param folder - Folder name in Cloudinary (default: 'giftcards')
 * @param filename - Optional filename (without extension)
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string = "giftcards",
  filename?: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: "image",
      format: "webp", // Always convert to WebP for optimization
      quality: "auto:good", // Automatic quality optimization
    };

    if (filename) {
      uploadOptions.public_id = filename;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        } else {
          reject(new Error("Upload failed: no result returned"));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param width - Target width (optional)
 * @param height - Target height (optional)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  const transformations: any = {
    fetch_format: "auto",
    quality: "auto:good",
  };

  if (width) transformations.width = width;
  if (height) transformations.height = height;
  if (width && height) transformations.crop = "fill";

  return cloudinary.url(publicId, transformations);
}

export default cloudinary;
