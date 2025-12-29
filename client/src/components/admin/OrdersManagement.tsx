import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function OrdersManagement() {
  const utils = trpc.useUtils();
  const { data: orders = [], isLoading } = trpc.orders.listAll.useQuery();

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.listAll.invalidate();
      toast.success("Estado del pedido actualizado");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleStatusChange = (orderId: number, status: "pending" | "processing" | "completed" | "cancelled") => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "default", label: "Pendiente" },
      processing: { variant: "secondary", label: "Procesando" },
      completed: { variant: "default", label: "Completado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
    };

    const config = variants[status] || variants.pending;
    
    return (
      <Badge variant={config.variant} className={
        status === "completed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
        status === "processing" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
        status === "pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
        ""
      }>
        {config.label}
      </Badge>
    );
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
        <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  No hay pedidos registrados.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customerName || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.customerEmail || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.customerPhone || "—"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(order.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as any)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="processing">Procesando</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
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
