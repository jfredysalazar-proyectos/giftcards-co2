import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CartModal } from "@/components/CartModal";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Search, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Design Philosophy: Playful Gradient Grid
 * - Dynamic gradients flowing from purple → cyan with peach accents
 * - Cards with individual colors and rounded corners (20px)
 * - Playful animations on hover: elevation + rotation + glow
 * - Typography: Fredoka (display/bold), Outfit (body/regular)
 * - Color palette: Purple (#A855F7), Cyan (#06B6D4), Peach (#FF6B35), White
 */

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  gradient: string;
  description: string;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: "psn-1",
    name: "PlayStation Network",
    category: "Videojuegos",
    price: "$10 - $100",
    image: "/images/product-category-psn.png",
    gradient: "from-purple-700 to-purple-500",
    description: "Tarjetas PSN para juegos, complementos y suscripciones",
  },
  {
    id: "xbox-1",
    name: "Xbox Game Pass",
    category: "Videojuegos",
    price: "$15 - $120",
    image: "/images/product-category-xbox.png",
    gradient: "from-teal-600 to-cyan-500",
    description: "Tarjetas Xbox y Game Pass para el juego definitivo",
  },
  {
    id: "nintendo-1",
    name: "Nintendo eShop",
    category: "Videojuegos",
    price: "$20 - $100",
    image: "/images/product-category-nintendo.png",
    gradient: "from-orange-500 to-red-500",
    description: "Juegos digitales y contenido de Nintendo Switch",
  },
  {
    id: "amazon-1",
    name: "Tarjetas de Regalo Amazon",
    category: "Compras",
    price: "$25 - $500",
    image: "/images/product-category-amazon.png",
    gradient: "from-orange-500 to-yellow-500",
    description: "Compra cualquier cosa en Amazon con entrega instantánea",
  },
  {
    id: "steam-1",
    name: "Billetera Steam",
    category: "Videojuegos",
    price: "$5 - $100",
    image: "/images/product-category-psn.png",
    gradient: "from-blue-600 to-cyan-500",
    description: "Tarjetas de regalo Steam para tu biblioteca de PC",
  },
  {
    id: "apple-1",
    name: "Tarjetas de Regalo Apple",
    category: "Tecnología",
    price: "$25 - $200",
    image: "/images/product-category-amazon.png",
    gradient: "from-gray-700 to-gray-500",
    description: "Aplicaciones, juegos y servicios en plataformas Apple",
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();

  const categories = ["Todos", "Videojuegos", "Compras", "Tecnología"];
  
  const filteredProducts = selectedCategory === "Todos" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const visibleCreators = CREATORS.slice(carouselIndex, carouselIndex + 3);

  const handleNextCreators = () => {
    setCarouselIndex((prev) => (prev + 1) % CREATORS.length);
  };

  const handlePrevCreators = () => {
    setCarouselIndex((prev) => (prev - 1 + CREATORS.length) % CREATORS.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">GC</span>
            </div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Giftcards.Co
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6 text-purple-600" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-cyan-50" />
        <img 
          src="/images/hero-banner.png" 
          alt="Banner Principal" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="font-display text-5xl font-bold text-white mb-4">
              Tu Centro de Tarjetas de Regalo Digitales
            </h2>
            <p className="text-white text-lg mb-8">
              Entrega instantánea de PSN, Xbox, Nintendo, Amazon y más
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar tarjetas de regalo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 rounded-lg border-0 shadow-lg"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-lg shadow-lg">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer transform transition duration-300 hover:scale-105 hover:rotate-1"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition">
                <div className={`h-64 bg-gradient-to-br ${product.gradient} relative overflow-hidden`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // Navigate to product detail or add to cart
                      const amount = "$25"; // Default amount
                      const price = 25;
                      const cartItem = {
                        id: `${product.id}-${amount}`,
                        productName: product.name,
                        amount,
                        quantity: 1,
                        price,
                      };
                      // For now, just show a toast
                      alert(`¡${product.name} agregado al carrito!`);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    Ver Detalles
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Spotlight Carousel */}
      <section className="bg-gradient-to-r from-purple-50 via-white to-cyan-50 py-16">
        <div className="container">
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            Creadores Destacados
          </h2>
          <div className="flex items-center gap-6">
            <button
              onClick={handlePrevCreators}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {visibleCreators.map((creator) => (
                <Card
                  key={creator.id}
                  className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  <div className="text-6xl mb-4">{creator.avatar}</div>
                  <h3 className="font-display text-xl font-bold mb-2">{creator.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{creator.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-900">{creator.rating}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                    Ver Perfil
                  </Button>
                </Card>
              ))}
            </div>

            <button
              onClick={handleNextCreators}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          </div>
        </div>
      </section>

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
            href="https://wa.me/1234567890?text=¡Hola%20Giftcards.Co!%20Quiero%20comprar%20una%20tarjeta%20de%20regalo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Chatear en WhatsApp
          </a>
        </div>
      </section>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
                <li><a href="#" className="hover:text-white transition">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition">Contáctanos</a></li>
                <li><a href="#" className="hover:text-white transition">Preguntas Frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Legal</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-white transition">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Política de Reembolso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Cuenta</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Mis Pedidos</a></li>
                <li><a href="#" className="hover:text-white transition">Mi Cuenta</a></li>
                <li><a href="#" className="hover:text-white transition">Iniciar Sesión</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Giftcards.Co. Todos los derechos reservados. | Impulsado por entrega digital instantánea</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
