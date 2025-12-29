import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function FAQsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: faqs = [], isLoading } = trpc.faqs.listAll.useQuery();

  const createMutation = trpc.faqs.create.useMutation({
    onSuccess: () => {
      utils.faqs.listAll.invalidate();
      utils.faqs.list.invalidate();
      setIsDialogOpen(false);
      toast.success("FAQ creada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.faqs.update.useMutation({
    onSuccess: () => {
      utils.faqs.listAll.invalidate();
      utils.faqs.list.invalidate();
      setIsDialogOpen(false);
      setEditingFAQ(null);
      toast.success("FAQ actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.faqs.delete.useMutation({
    onSuccess: () => {
      utils.faqs.listAll.invalidate();
      utils.faqs.list.invalidate();
      toast.success("FAQ eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      order: parseInt(formData.get("order") as string) || 0,
      published: formData.get("published") === "true",
    };

    if (editingFAQ) {
      updateMutation.mutate({ id: editingFAQ.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (faq: any) => {
    setEditingFAQ(faq);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta FAQ?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFAQ(null);
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
        <h2 className="text-2xl font-bold">Gestión de FAQs</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Nueva FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFAQ ? "Editar FAQ" : "Crear Nueva FAQ"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question">Pregunta *</Label>
                <Input
                  id="question"
                  name="question"
                  defaultValue={editingFAQ?.question}
                  required
                />
              </div>
              <div>
                <Label htmlFor="answer">Respuesta *</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  defaultValue={editingFAQ?.answer}
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingFAQ?.order || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="published">Estado</Label>
                  <Select name="published" defaultValue={editingFAQ?.published ? "true" : "true"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Publicada</SelectItem>
                      <SelectItem value="false">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
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
                    "Guardar"
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
              <TableHead>Orden</TableHead>
              <TableHead>Pregunta</TableHead>
              <TableHead>Respuesta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No hay FAQs. Crea una nueva para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              faqs
                .sort((a, b) => a.order - b.order)
                .map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium">{faq.order}</TableCell>
                    <TableCell className="font-medium max-w-xs">
                      {faq.question}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-md truncate">
                      {faq.answer}
                    </TableCell>
                    <TableCell>
                      {faq.published ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Publicada
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                          Borrador
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(faq)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
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
