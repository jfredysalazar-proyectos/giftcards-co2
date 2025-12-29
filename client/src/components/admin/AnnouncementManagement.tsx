import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Megaphone, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AnnouncementManagement() {
  const { data: announcement, isLoading } = trpc.announcements.getActive.useQuery();
  const utils = trpc.useUtils();

  const [text, setText] = useState(announcement?.text || "");
  const [isActive, setIsActive] = useState(announcement?.isActive ?? true);
  const [backgroundColor, setBackgroundColor] = useState(announcement?.backgroundColor || "#7c3aed");
  const [textColor, setTextColor] = useState(announcement?.textColor || "#ffffff");

  // Update local state when announcement data loads
  useState(() => {
    if (announcement) {
      setText(announcement.text);
      setIsActive(announcement.isActive);
      setBackgroundColor(announcement.backgroundColor);
      setTextColor(announcement.textColor);
    }
  });

  const createMutation = trpc.announcements.create.useMutation({
    onSuccess: () => {
      utils.announcements.getActive.invalidate();
      toast.success("Anuncio creado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al crear anuncio: ${error.message}`);
    },
  });

  const updateMutation = trpc.announcements.update.useMutation({
    onSuccess: () => {
      utils.announcements.getActive.invalidate();
      toast.success("Anuncio actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al actualizar anuncio: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("El texto del anuncio es requerido");
      return;
    }

    const data = {
      text: text.trim(),
      isActive,
      backgroundColor,
      textColor,
    };

    if (announcement) {
      updateMutation.mutate({ id: announcement.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Anuncios</h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Vista Previa
            </Label>
            <div
              className="w-full py-3 px-4 text-center text-sm font-medium rounded-lg flex items-center justify-center gap-2"
              style={{
                backgroundColor: backgroundColor,
                color: textColor,
              }}
            >
              <Megaphone className="w-4 h-4" />
              <span>{text || "Texto del anuncio aparecerá aquí"}</span>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <Label htmlFor="announcement-text" className="text-sm font-medium text-gray-700">
              Texto del Anuncio
            </Label>
            <Input
              id="announcement-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Ejemplo: TRM para Hoy es de: $3900 COP por Dólar'
              className="mt-1"
              required
            />
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="announcement-active" className="text-sm font-medium text-gray-700">
              Anuncio Activo
            </Label>
            <Switch
              id="announcement-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="background-color" className="text-sm font-medium text-gray-700">
                Color de Fondo
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#7c3aed"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="text-sm font-medium text-gray-700">
                Color de Texto
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {announcement ? "Actualizar Anuncio" : "Crear Anuncio"}
              </>
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> El anuncio aparecerá en la parte superior de la tienda cuando esté activo.
          Los visitantes pueden cerrarlo haciendo clic en la X.
        </p>
      </Card>
    </div>
  );
}
