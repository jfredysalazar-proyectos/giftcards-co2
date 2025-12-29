import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

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
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const newImage: ImageEntry = {
      url: newImageUrl,
      displayOrder: images.length,
      isPrimary: images.length === 0, // Primera imagen es primaria por defecto
    };

    onChange([...images, newImage]);
    setNewImageUrl("");
    toast.success("Imagen agregada");
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
          <Label htmlFor="imageUrl">URL de Imagen</Label>
          <input
            id="imageUrl"
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="/images/product-image.webp"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddImage}
            variant="outline"
            disabled={images.length >= maxImages}
          >
            <Upload className="w-4 h-4 mr-2" />
            Agregar
          </Button>
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
                  {image.url || "Sin URL"}
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
