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
import { Plus, Edit, Trash2, Loader2, X, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";
import { RichTextEditor } from "./RichTextEditor";

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
  
  // SEO character counters
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

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
      resetForm();
      setIsDialogOpen(false);
      toast.success("Producto creado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: async (product) => {
      // Only update images if they were actually modified
      const imagesWereModified = productImages.length !== existingImages.length ||
        productImages.some((img, idx) => {
          const existing = existingImages[idx];
          return !existing || img.url !== existing.imageUrl || img.isPrimary !== existing.isPrimary;
        });
      
      if (imagesWereModified && productImages.length > 0) {
        const currentImageIds = productImages.filter(img => img.id).map(img => img.id!);
        const imagesToDelete = existingImages.filter(img => !currentImageIds.includes(img.id));
        
        for (const img of imagesToDelete) {
          await deleteImageMutation.mutateAsync({ id: img.id });
        }
        
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
      resetForm();
      setIsDialogOpen(false);
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

  const resetForm = () => {
    setEditingProduct(null);
    setLoadingProductId(null);
    setAmounts([{ amount: "", price: "" }]);
    setProductImages([]);
    setMetaTitle("");
    setMetaDescription("");
    setFullDescription("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate amounts
    const validAmounts = amounts.filter(a => a.amount && a.price);
    if (validAmounts.length === 0) {
      toast.error("Debes agregar al menos un monto válido");
      return;
    }

    // Validate SEO fields
    if (metaTitle.length > 60) {
      toast.error("El Meta Title debe tener máximo 60 caracteres");
      return;
    }
    
    if (metaDescription.length > 160) {
      toast.error("La Meta Description debe tener máximo 160 caracteres");
      return;
    }

    // Get primary image for backward compatibility
    const primaryImage = productImages.find(img => img.isPrimary)?.url || productImages[0]?.url || "";

    const data = {
      name: metaTitle,
      slug: formData.get("slug") as string,
      description: metaDescription,
      fullDescription: fullDescription,
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
    setMetaTitle(product.name || "");
    setMetaDescription(product.description || "");
    setFullDescription(product.fullDescription || "");
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
    resetForm();
    setIsDialogOpen(true);
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
              {/* SEO Section */}
              <div className="space-y-4 border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Optimización SEO</h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Meta Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="metaTitle">Meta Title (Título SEO) *</Label>
                    <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-500 font-semibold' : metaTitle.length > 50 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {metaTitle.length}/60
                    </span>
                  </div>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Tarjeta PlayStation Store USA $10 | Entrega Inmediata"
                    required
                    maxLength={70}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Incluye palabras clave principales y ubicación. Aparece en Google y pestañas del navegador.</span>
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="metaDescription">Meta Description (Descripción SEO) *</Label>
                    <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500 font-semibold' : metaDescription.length > 150 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {metaDescription.length}/160
                    </span>
                  </div>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Compra tu tarjeta PlayStation Store de $10 USD. Entrega inmediata en Colombia. Recarga tu PSN y accede a juegos, DLC y más."
                    rows={3}
                    required
                    maxLength={170}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Resumen atractivo que aparece en resultados de Google. Debe motivar al clic.</span>
                  </p>
                </div>
              </div>

              {/* Basic Product Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Información Básica</h3>
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editingProduct?.slug}
                    placeholder="tarjeta-playstation-store-usa-10"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">URL amigable (solo letras minúsculas, números y guiones)</p>
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
                
                {/* Rich Text Editor for Full Description */}
                <div>
                  <Label htmlFor="fullDescription">Descripción Completa del Producto</Label>
                  <p className="text-xs text-gray-500 mb-2">Usa el editor para dar formato al texto (negritas, listas, enlaces, etc.)</p>
                  <RichTextEditor
                    content={fullDescription}
                    onChange={setFullDescription}
                    placeholder="Describe detalladamente el producto, cómo funciona, beneficios, instrucciones de uso..."
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
              </div>

              {/* Stock and Featured */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Estado</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      name="inStock"
                      value="true"
                      defaultChecked={editingProduct?.inStock ?? true}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="inStock">En Stock</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      value="true"
                      defaultChecked={editingProduct?.featured ?? false}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="featured">Producto Destacado</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingProduct ? "Actualizar" : "Crear"} Producto
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell className="text-sm text-gray-500">{product.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.inStock ? 'En Stock' : 'Agotado'}
                  </span>
                </TableCell>
                <TableCell>
                  {product.featured && (
                    <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">Sí</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
