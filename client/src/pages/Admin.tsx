import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Package, ShoppingCart, Star, HelpCircle, Loader2 } from "lucide-react";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { CategoriesManagement } from "@/components/admin/CategoriesManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { ReviewsManagement } from "@/components/admin/ReviewsManagement";
import { FAQsManagement } from "@/components/admin/FAQsManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import AnnouncementManagement from "@/components/admin/AnnouncementManagement";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: orders = [] } = trpc.orders.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: reviews = [] } = trpc.reviews.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const pendingReviews = reviews.filter(r => !r.approved).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-600">Giftcards.Co</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin: {user.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
            >
              Ver Sitio
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pedidos Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reseñas Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingReviews}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="announcements">Anuncios</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsManagement />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManagement />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsManagement />
            </TabsContent>

            <TabsContent value="faqs">
              <FAQsManagement />
            </TabsContent>

            <TabsContent value="announcements">
              <AnnouncementManagement />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsManagement />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
