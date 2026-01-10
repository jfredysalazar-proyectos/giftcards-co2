import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImageEntry {
  id?: number;
  url: string;
  displayOrder: number;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 3 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const uploadMutation = trpc.upload.uploadImage.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          
          // Upload to Cloudinary
          const result = await uploadMutation.mutateAsync({
            imageData: base64,
            folder: 'giftcards/products',
            filename: file.name.split('.')[0] // Remove extension
          });

          const newImage: ImageEntry = {
            url: result.url,
            displayOrder: images.length,
            isPrimary: images.length === 0, // Primera imagen es primaria por defecto
          };

          onChange([...images, newImage]);
          toast.success(`Imagen subida exitosamente (${(result.bytes / 1024).toFixed(1)} KB)`);
          
          // Reset file input
          e.target.value = '';
        } catch (error: any) {
          toast.error(`Error al subir imagen: ${error.message}`);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Error al leer el archivo");
        setUploading(false);
      };
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reordenar displayOrder
    const reordered = newImages.map((img, i) => ({
      ...img,
      displayOrder: i,
      isPrimary: i === 0 ? true : img.isPrimary && i !== 0 ? false : img.isPrimary,
    }));
    onChange(reordered);
    toast.success("Imagen eliminada");
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
    toast.success("Imagen principal actualizada");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    // Actualizar displayOrder
    const reordered = newImages.map((img, i) => ({
      ...img,
      displayOrder: i,
    }));
    onChange(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    // Actualizar displayOrder
    const reordered = newImages.map((img, i) => ({
      ...img,
      displayOrder: i,
    }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="imageFile">Subir Imagen a Cloudinary</Label>
          <div className="flex gap-2">
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading || images.length >= maxImages}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
            />
            {uploading && (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formatos: JPG, PNG, WebP. Máximo 5MB. Se convertirá automáticamente a WebP optimizado.
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {images.length} / {maxImages} imágenes agregadas
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative border rounded-lg p-3 ${
                image.isPrimary ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" : "border-border"
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-video bg-muted rounded-md mb-2 overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground truncate">
                  {image.url ? new URL(image.url).pathname.split('/').pop() : "Sin URL"}
                </div>

                {image.isPrimary && (
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    ★ Imagen Principal
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetPrimary(index)}
                      className="text-xs flex-1"
                    >
                      Hacer Principal
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-xs"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1}
                    className="text-xs"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    className="text-xs"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
