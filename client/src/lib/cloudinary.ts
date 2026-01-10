/**
 * Cloudinary Image Transformation Helpers
 * 
 * Genera URLs optimizadas de Cloudinary con transformaciones en tiempo real
 */

const CLOUDINARY_CLOUD_NAME = "dmucbeeyi";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Extrae el public_id de una URL de Cloudinary
 */
function extractPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) {
    return null;
  }
  
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
}

/**
 * Genera una URL de Cloudinary con transformaciones
 * 
 * @param url - URL original de Cloudinary
 * @param transformations - Transformaciones a aplicar (ej: "w_300,h_300,c_fill")
 * @returns URL transformada o URL original si no es de Cloudinary
 */
export function getTransformedImageUrl(url: string, transformations: string): string {
  const publicId = extractPublicId(url);
  
  if (!publicId) {
    return url; // No es una URL de Cloudinary, retornar original
  }
  
  return `${CLOUDINARY_BASE_URL}/${transformations}/${publicId}`;
}

/**
 * Genera una URL de thumbnail optimizada (300x300)
 */
export function getThumbnailUrl(url: string): string {
  return getTransformedImageUrl(url, "w_300,h_300,c_fill,q_auto:good,f_auto");
}

/**
 * Genera una URL de imagen pequeña para cards (400x300)
 */
export function getCardImageUrl(url: string): string {
  return getTransformedImageUrl(url, "w_400,h_300,c_fill,q_auto:good,f_auto");
}

/**
 * Genera una URL de imagen mediana para detalles (800x600)
 */
export function getMediumImageUrl(url: string): string {
  return getTransformedImageUrl(url, "w_800,h_600,c_fit,q_auto:good,f_auto");
}

/**
 * Genera una URL de imagen grande para hero/banners (1200x800)
 */
export function getLargeImageUrl(url: string): string {
  return getTransformedImageUrl(url, "w_1200,h_800,c_fill,q_auto:good,f_auto");
}

/**
 * Genera una URL de imagen responsive con múltiples tamaños
 * Útil para el atributo srcset
 */
export function getResponsiveImageUrls(url: string): {
  small: string;
  medium: string;
  large: string;
} {
  return {
    small: getTransformedImageUrl(url, "w_400,q_auto:good,f_auto"),
    medium: getTransformedImageUrl(url, "w_800,q_auto:good,f_auto"),
    large: getTransformedImageUrl(url, "w_1200,q_auto:good,f_auto"),
  };
}

/**
 * Genera una URL con blur placeholder para lazy loading
 */
export function getBlurPlaceholderUrl(url: string): string {
  return getTransformedImageUrl(url, "w_20,h_20,e_blur:1000,q_auto:low,f_auto");
}

/**
 * Genera srcset para imágenes responsive
 */
export function generateSrcSet(url: string): string {
  const responsive = getResponsiveImageUrls(url);
  return `${responsive.small} 400w, ${responsive.medium} 800w, ${responsive.large} 1200w`;
}
