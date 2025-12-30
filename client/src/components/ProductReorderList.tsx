import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  displayOrder: number;
}

interface SortableProductProps {
  product: Product;
  index: number;
}

function SortableProduct({ product, index }: SortableProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'shadow-xl ring-2 ring-primary' : ''}`}>
        <div className="flex items-center gap-4">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
          )}

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.slug}</p>
          </div>

          <div className="text-sm text-muted-foreground">
            Orden: {product.displayOrder}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ProductReorderList() {

  const [products, setProducts] = useState<Product[]>([]);
  
  const { data: productsData, isLoading } = trpc.products.list.useQuery();
  const updateOrderMutation = trpc.products.updateDisplayOrder.useMutation({
    onSuccess: () => {
      toast.success("✅ Orden actualizado: Los productos se han reordenado correctamente.");
    },
    onError: (error: any) => {
      toast.error(`❌ Error: ${error.message || "No se pudo actualizar el orden de los productos."}`);
    },
  });

  useEffect(() => {
    if (productsData) {
      // Sort by displayOrder first, then by createdAt
      const sorted = [...productsData].sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setProducts(sorted);
    }
  }, [productsData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update displayOrder for all products based on new positions
        const updates = newItems.map((product, index) => ({
          id: product.id,
          displayOrder: index + 1,
        }));

        // Send update to server
        updateOrderMutation.mutate({ updates });

        return newItems;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-muted rounded" />
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="w-16 h-16 bg-muted rounded-md" />
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p>No hay productos para reordenar.</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reordenar Productos</h2>
        <p className="text-muted-foreground">
          Arrastra y suelta los productos para cambiar su orden de visualización en la página principal.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {products.map((product, index) => (
            <SortableProduct key={product.id} product={product} index={index} />
          ))}
        </SortableContext>
      </DndContext>

      {updateOrderMutation.isPending && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-primary font-medium">Guardando cambios...</p>
        </div>
      )}
    </div>
  );
}
