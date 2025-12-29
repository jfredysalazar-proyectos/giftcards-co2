import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Search, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { CartModal } from "@/components/CartModal";
import { getLoginUrl } from "@/const";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
}

const CREATORS: Creator[] = [
  {
    id: "creator-1",
    name: "Pro Gamer",
    avatar: "🎮",
    specialty: "Juegos de Consola",
    rating: 4.9,
  },
  {
    id: "creator-2",
    name: "Experto Digital",
    avatar: "💻",
    specialty: "Servicios Digitales",
    rating: 4.8,
  },
  {
    id: "creator-3",
    name: "Estrella de Streaming",
    avatar: "🎬",
    specialty: "Entretenimiento",
    rating: 4.7,
  },
  {
    id: "creator-4",
    name: "Gurú de Tecnología",
    avatar: "⚡",
    specialty: "Productos Tecnológicos",
    rating: 4.9,
  },
];

export default function Home() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { items: cartItems, total: cartTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch categories and products
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: allProducts = [], isLoading: productsLoading } = trpc.products.list.useQuery();
  
  // Fetch WhatsApp number from settings
  const { data: whatsappSetting } = trpc.settings.get.useQuery({ key: "whatsapp_number" });
  const whatsappNumber = whatsappSetting?.value || "+573334315646";

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  const visibleCreators = CREATORS.slice(carouselIndex, carouselIndex + 3);

  const handleNextCreators = () => {
    setCarouselIndex((prev) => (prev + 1) % CREATORS.length);
  };

  const handlePrevCreators = () => {
    setCarouselIndex((prev) => (prev - 1 + CREATORS.length) % CREATORS.length);
  };

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img 
                src="/logo-giftcards-colombia.webp" 
                alt="GiftCards Colombia" 
                className="h-16 w-auto"
              />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hola, {user?.name}</span>
                <Link href="/my-orders">
                  <Button variant="ghost" size="sm">
                    Mis Pedidos
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Search Bar */}
      <section className="container -mt-8 relative z-10">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar tarjetas de regalo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-xl border-0 shadow-2xl bg-white"
            />
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl shadow-2xl">
            Buscar
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              selectedCategory === null
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <div className="group cursor-pointer transform transition duration-300 hover:scale-105 hover:rotate-1">
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition">
                    <div className={`h-64 bg-gradient-to-br ${product.gradient || "from-gray-400 to-gray-600"} relative overflow-hidden`}>
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          Desde $10
                        </span>
                        {product.inStock ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            En Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Agotado
                          </span>
                        )}
                      </div>
                      <Button className="relative overflow-hidden w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        <span className="relative z-10">Ver Detalles</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section with WhatsApp */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-600 py-16 text-white">
        <div className="container text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            ¿Listo para obtener tu Tarjeta de Regalo?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Chatea con nosotros en WhatsApp para comprar al instante y recibir soporte
          </p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=¡Hola%20GiftCards Colombia!%20Quiero%20comprar%20una%20tarjeta%20de%20regalo`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Chatear en WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-display font-bold text-white mb-4">Acerca de</h3>
              <p className="text-sm">Tu marketplace confiable para tarjetas de regalo digitales instantáneas.</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Soporte</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/faq"><a className="hover:text-white transition cursor-pointer">Preguntas Frecuentes</a></Link></li>
                <li><Link href="/help"><a className="hover:text-white transition cursor-pointer">Centro de Ayuda</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-white transition cursor-pointer">Contáctanos</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Legal</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/terms"><a className="hover:text-white transition cursor-pointer">Términos de Servicio</a></Link></li>
                <li><Link href="/privacy"><a className="hover:text-white transition cursor-pointer">Política de Privacidad</a></Link></li>
                <li><Link href="/refund"><a className="hover:text-white transition cursor-pointer">Política de Reembolso</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Cuenta</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/orders"><a className="hover:text-white transition">Mis Pedidos</a></Link></li>
                <li><a href={getLoginUrl()} className="hover:text-white transition">Iniciar Sesión</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 GiftCards Colombia. Todos los derechos reservados. | Impulsado por entrega digital instantánea</p>
          </div>
        </div>
      </footer>
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
