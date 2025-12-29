import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";

type AmountEntry = {
  amount: string;
  price: string;
};

type ImageEntry = {
  id?: number;
  url: string;
  displayOrder: number;
  isPrimary: boolean;
};

export function ProductsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [amounts, setAmounts] = useState<AmountEntry[]>([{ amount: "", price: "" }]);
  const [productImages, setProductImages] = useState<ImageEntry[]>([]);

  const utils = trpc.useUtils();
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { data: categories = [] } = trpc.categories.list.useQuery();
  
  // Query for loading existing amounts when editing
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const { data: existingAmounts = [] } = trpc.products.getAmounts.useQuery(
    { productId: loadingProductId! },
    { enabled: loadingProductId !== null }
  );
  
  // Query for loading existing images when editing
  const { data: existingImages = [] } = trpc.products.getImages.useQuery(
    { productId: loadingProductId! },
    { enabled: loadingProductId !== null }
  );

  const createMutation = trpc.products.create.useMutation({
    onSuccess: async (product) => {
      // Save product images
      for (const image of productImages) {
        await createImageMutation.mutateAsync({
          productId: product.id,
          imageUrl: image.url,
          displayOrder: image.displayOrder,
          isPrimary: image.isPrimary,
        });
      }
      utils.products.list.invalidate();
      setIsDialogOpen(false);
      setEditingProduct(null);
      setLoadingProductId(null);
      setAmounts([{ amount: "", price: "" }]);
      setProductImages([]);
      toast.success("Producto creado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: async (product) => {
      // Only update images if they were actually modified (productImages has items)
      if (productImages.length > 0) {
        // Delete old images that are not in the current list
        const currentImageIds = productImages.filter(img => img.id).map(img => img.id!);
        const imagesToDelete = existingImages.filter(img => !currentImageIds.includes(img.id));
        
        for (const img of imagesToDelete) {
          await deleteImageMutation.mutateAsync({ id: img.id });
        }
        
        // Create new images (those without id)
        const newImages = productImages.filter(img => !img.id);
        for (const image of newImages) {
          await createImageMutation.mutateAsync({
            productId: editingProduct.id,
            imageUrl: image.url,
            displayOrder: image.displayOrder,
            isPrimary: image.isPrimary,
          });
        }
      }
      
      utils.products.list.invalidate();
      setIsDialogOpen(false);
      setEditingProduct(null);
      setLoadingProductId(null);
      setAmounts([{ amount: "", price: "" }]);
      setProductImages([]);
      toast.success("Producto actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success("Producto eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const createImageMutation = trpc.products.createImage.useMutation({
    onError: (error) => {
      toast.error(`Error al guardar imagen: ${error.message}`);
    },
  });

  const deleteImageMutation = trpc.products.deleteImage.useMutation({
    onError: (error) => {
      toast.error(`Error al eliminar imagen: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate amounts
    const validAmounts = amounts.filter(a => a.amount && a.price);
    if (validAmounts.length === 0) {
      toast.error("Debes agregar al menos un monto válido");
      return;
    }

    // Get primary image for backward compatibility
    const primaryImage = productImages.find(img => img.isPrimary)?.url || productImages[0]?.url || "";

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      fullDescription: formData.get("fullDescription") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      image: primaryImage,
      gradient: formData.get("gradient") as string,
      inStock: formData.get("inStock") === "true",
      featured: formData.get("featured") === "true",
      amounts: validAmounts.map(a => ({
        amount: a.amount,
        price: parseFloat(a.price)
      }))
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = async (product: any) => {
    setEditingProduct(product);
    setLoadingProductId(product.id);
    setIsDialogOpen(true);
  };
  
  // Effect to load amounts and images when editing
  useEffect(() => {
    if (editingProduct && existingAmounts.length > 0) {
      setAmounts(existingAmounts.map(a => ({
        amount: a.amount.toString(),
        price: a.price.toString()
      })));
    }
  }, [editingProduct, existingAmounts]);
  
  useEffect(() => {
    if (editingProduct && existingImages.length > 0) {
      setProductImages(existingImages.map(img => ({
        id: img.id,
        url: img.imageUrl,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary
      })));
    }
  }, [editingProduct, existingImages]);

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setLoadingProductId(null);
    setIsDialogOpen(true);
    setAmounts([{ amount: "", price: "" }]);
    setProductImages([]);
  };

  const handleAddAmount = () => {
    setAmounts([...amounts, { amount: "", price: "" }]);
  };

  const handleRemoveAmount = (index: number) => {
    if (amounts.length > 1) {
      setAmounts(amounts.filter((_, i) => i !== index));
    }
  };

  const handleAmountChange = (index: number, field: "amount" | "price", value: string) => {
    const newAmounts = [...amounts];
    newAmounts[index][field] = value;
    setAmounts(newAmounts);
  };

  const addPresetAmount = (amount: string) => {
    const exists = amounts.some(a => a.amount === amount);
    if (!exists) {
      setAmounts([...amounts, { amount, price: amount }]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct} className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Product Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Información Básica</h3>
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editingProduct?.slug}
                    placeholder="playstation-network"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryId">Categoría *</Label>
                  <Select name="categoryId" defaultValue={editingProduct?.categoryId?.toString()} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción Corta</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingProduct?.description || ""}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="fullDescription">Descripción Completa</Label>
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    defaultValue={editingProduct?.fullDescription || ""}
                    rows={4}
                  />
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Apariencia</h3>
                <div>
                  <Label>Imágenes del Producto (Hasta 3)</Label>
                  <ImageUploader
                    images={productImages}
                    onChange={setProductImages}
                    maxImages={3}
                  />
                </div>
                <div>
                  <Label htmlFor="gradient">Gradiente CSS</Label>
                  <Input
                    id="gradient"
                    name="gradient"
                    defaultValue={editingProduct?.gradient || ""}
                    placeholder="from-purple-700 to-purple-500"
                  />
                </div>
              </div>

              {/* Amounts Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Montos Disponibles</h3>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => addPresetAmount("10")}>
                      +$10
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addPresetAmount("25")}>
                      +$25
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addPresetAmount("50")}>
                      +$50
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addPresetAmount("100")}>
                      +$100
                    </Button>
                  </div>
                </div>
                
                <Card className="p-4 space-y-3">
                  {amounts.map((amount, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label htmlFor={`amount-${index}`}>Monto</Label>
                        <Input
                          id={`amount-${index}`}
                          placeholder="10, 25, 50, 100..."
                          value={amount.amount}
                          onChange={(e) => handleAmountChange(index, "amount", e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`price-${index}`}>Precio (USD)</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          step="0.01"
                          placeholder="10.00"
                          value={amount.price}
                          onChange={(e) => handleAmountChange(index, "price", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAmount(index)}
                        disabled={amounts.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAmount}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Monto
                  </Button>
                </Card>
                <p className="text-sm text-gray-500">
                  Nota: Los montos se guardarán después de crear el producto. Usa los botones rápidos o agrega montos personalizados.
                </p>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Configuración</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inStock">En Stock</Label>
                    <Select name="inStock" defaultValue={editingProduct?.inStock ? "true" : "false"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="featured">Destacado</Label>
                    <Select name="featured" defaultValue={editingProduct?.featured ? "true" : "false"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Producto"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No hay productos. Crea uno nuevo para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {categories.find(c => c.id === product.categoryId)?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{product.slug}</TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        En Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Agotado
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.featured ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Sí
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
