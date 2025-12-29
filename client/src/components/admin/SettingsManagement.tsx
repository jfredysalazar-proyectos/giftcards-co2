import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Phone } from "lucide-react";

export default function SettingsManagement() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get WhatsApp number setting
  const { data: whatsappSetting, isLoading, refetch } = trpc.settings.get.useQuery({ 
    key: "whatsapp_number" 
  });

  const updateSettingMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Configuración actualizada correctamente");
      refetch();
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (whatsappSetting) {
      setWhatsappNumber(whatsappSetting.value);
    }
  }, [whatsappSetting]);

  const handleSave = async () => {
    if (!whatsappNumber.trim()) {
      toast.error("El número de WhatsApp no puede estar vacío");
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(whatsappNumber.replace(/\s/g, ""))) {
      toast.error("Por favor ingresa un número de teléfono válido (ej: +573334315646)");
      return;
    }

    setIsSaving(true);
    updateSettingMutation.mutate({
      key: "whatsapp_number",
      value: whatsappNumber,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración general del sitio web
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Número de WhatsApp
          </CardTitle>
          <CardDescription>
            Este número se utilizará en todos los botones de contacto y compra por WhatsApp del sitio web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Número de WhatsApp (con código de país)</Label>
            <Input
              id="whatsapp"
              type="text"
              placeholder="+573334315646"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              Formato: +[código de país][número] (ej: +573334315646 para Colombia)
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
          <CardDescription>
            Así se verá el enlace de WhatsApp para los clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Contactar por WhatsApp
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
