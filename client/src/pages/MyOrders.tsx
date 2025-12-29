import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search,
  Loader2,
  ShoppingBag,
  Calendar,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function MyOrders() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders = [], isLoading } = trpc.orders.myOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
      pending: {
        label: "Pendiente",
        icon: Clock,
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
      },
      processing: {
        label: "Procesando",
        icon: Package,
        color: "text-blue-700",
        bgColor: "bg-blue-100",
      },
      completed: {
        label: "Completado",
        icon: CheckCircle,
        color: "text-green-700",
        bgColor: "bg-green-100",
      },
      cancelled: {
        label: "Cancelado",
        icon: XCircle,
        color: "text-red-700",
        bgColor: "bg-red-100",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleDownloadCode = (orderId: number, productName: string) => {
    // Simulate code download
    const code = `GIFT-${orderId}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const blob = new Blob([`Código de Regalo - ${productName}\n\nCódigo: ${code}\n\nGracias por tu compra en Giftcards.Co`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codigo-regalo-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Código descargado exitosamente");
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      (order.customerName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    pending: orders.filter(o => o.status === "pending").length,
    totalSpent: orders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">GC</span>
              </div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Giftcards.Co
              </h1>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-600 py-12 text-white">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <ShoppingBag className="w-12 h-12" />
            <div>
              <h1 className="font-display text-4xl font-bold">Mis Pedidos</h1>
              <p className="text-lg opacity-90">Hola, {user?.name || "Cliente"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-16 relative z-10">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completados</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Gastado</p>
                <p className="text-3xl font-bold text-cyan-600">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="container py-6">
        <Card className="p-6 border-0 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por ID de pedido o nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </section>

      {/* Orders List */}
      <section className="container pb-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? "No tienes pedidos aún" : "No se encontraron pedidos"}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? "Comienza a comprar tus tarjetas de regalo favoritas"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                Explorar Productos
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} className="border-0 shadow-md overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            Pedido #{order.id}
                          </h3>
                          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} hover:${statusInfo.bgColor}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${parseFloat(order.totalAmount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {order.status === "completed" && (
                        <Button
                          onClick={() => handleDownloadCode(order.id, "Tarjeta de Regalo")}
                          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Códigos
                        </Button>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium text-gray-900">Nombre:</span> {order.customerName}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium text-gray-900">Email:</span> {order.customerEmail}
                          </p>
                          {order.customerPhone && (
                            <p className="text-gray-600">
                              <span className="font-medium text-gray-900">Teléfono:</span> {order.customerPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Estado del Pedido</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${order.status === "pending" || order.status === "processing" || order.status === "completed" ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center`}>
                              <CheckCircle className={`w-5 h-5 ${order.status === "pending" || order.status === "processing" || order.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Pedido Recibido</p>
                              <p className="text-xs text-gray-500">Tu pedido ha sido confirmado</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${order.status === "processing" || order.status === "completed" ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center`}>
                              <Package className={`w-5 h-5 ${order.status === "processing" || order.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Procesando</p>
                              <p className="text-xs text-gray-500">Estamos preparando tu pedido</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${order.status === "completed" ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center`}>
                              <CheckCircle className={`w-5 h-5 ${order.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Completado</p>
                              <p className="text-xs text-gray-500">Códigos entregados</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Notas</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container text-center">
          <p className="text-sm">&copy; 2025 Giftcards.Co. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
