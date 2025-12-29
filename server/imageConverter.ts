import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Convert an image to WebP format
 * @param inputPath - Path to the input image file
 * @param quality - WebP quality (0-100), default 85
 * @returns Path to the converted WebP file
 */
export async function convertToWebP(
  inputPath: string,
  quality: number = 85
): Promise<string> {
  const ext = path.extname(inputPath).toLowerCase();
  
  // If already WebP, return as is
  if (ext === '.webp') {
    return inputPath;
  }
  
  // Check if file is an image
  const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp'];
  if (!validExtensions.includes(ext)) {
    throw new Error(`Unsupported image format: ${ext}`);
  }
  
  // Generate output path
  const outputPath = inputPath.replace(/\.[^.]+$/, '.webp');
  
  try {
    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    // Delete original file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw error;
  }
}

/**
 * Convert an image buffer to WebP format
 * @param buffer - Image buffer
 * @param quality - WebP quality (0-100), default 85
 * @returns WebP buffer
 */
export async function convertBufferToWebP(
  buffer: Buffer,
  quality: number = 85
): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .webp({ quality })
      .toBuffer();
  } catch (error) {
    console.error('Error converting buffer to WebP:', error);
    throw error;
  }
}

/**
 * Get WebP path from original image path
 * @param originalPath - Original image path
 * @returns WebP path
 */
export function getWebPPath(originalPath: string): string {
  return originalPath.replace(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i, '.webp');
}
