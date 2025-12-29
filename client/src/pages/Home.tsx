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
    category: "Gaming",
    price: "$10 - $100",
    image: "/images/product-category-psn.png",
    gradient: "from-purple-700 to-purple-500",
    description: "PSN Gift Cards for games, add-ons, and subscriptions",
  },
  {
    id: "xbox-1",
    name: "Xbox Game Pass",
    category: "Gaming",
    price: "$15 - $120",
    image: "/images/product-category-xbox.png",
    gradient: "from-teal-600 to-cyan-500",
    description: "Xbox and Game Pass gift cards for ultimate gaming",
  },
  {
    id: "nintendo-1",
    name: "Nintendo eShop",
    category: "Gaming",
    price: "$20 - $100",
    image: "/images/product-category-nintendo.png",
    gradient: "from-orange-500 to-red-500",
    description: "Nintendo Switch digital games and content",
  },
  {
    id: "amazon-1",
    name: "Amazon Gift Cards",
    category: "Shopping",
    price: "$25 - $500",
    image: "/images/product-category-amazon.png",
    gradient: "from-orange-500 to-yellow-500",
    description: "Shop anything on Amazon with instant delivery",
  },
  {
    id: "steam-1",
    name: "Steam Wallet",
    category: "Gaming",
    price: "$5 - $100",
    image: "/images/product-category-psn.png",
    gradient: "from-blue-600 to-cyan-500",
    description: "Steam gift cards for PC gaming library",
  },
  {
    id: "apple-1",
    name: "Apple Gift Cards",
    category: "Tech",
    price: "$25 - $200",
    image: "/images/product-category-amazon.png",
    gradient: "from-gray-700 to-gray-500",
    description: "Apps, games, and services on Apple platforms",
  },
];

const CREATORS: Creator[] = [
  {
    id: "creator-1",
    name: "Gaming Pro",
    avatar: "🎮",
    specialty: "Console Games",
    rating: 4.9,
  },
  {
    id: "creator-2",
    name: "Digital Expert",
    avatar: "💻",
    specialty: "Digital Services",
    rating: 4.8,
  },
  {
    id: "creator-3",
    name: "Streaming Star",
    avatar: "🎬",
    specialty: "Entertainment",
    rating: 4.7,
  },
  {
    id: "creator-4",
    name: "Tech Guru",
    avatar: "⚡",
    specialty: "Tech Products",
    rating: 4.9,
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();

  const categories = ["All", "Gaming", "Shopping", "Tech"];
  
  const filteredProducts = selectedCategory === "All" 
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
          alt="Hero Banner" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="font-display text-5xl font-bold text-white mb-4">
              Your Digital Gift Card Hub
            </h2>
            <p className="text-white text-lg mb-8">
              Instant delivery of PSN, Xbox, Nintendo, Amazon & more
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search gift cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 rounded-lg border-0 shadow-lg"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-lg shadow-lg">
                Search
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
                alert(`Added ${product.name} to cart!`);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              View Details
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
            Creator Spotlight
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
                    View Profile
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
            Ready to Get Your Gift Card?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Chat with us on WhatsApp for instant checkout and support
          </p>
          <a
            href="https://wa.me/1234567890?text=Hi%20Giftcards.Co%21%20I%20want%20to%20buy%20a%20gift%20card"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Chat on WhatsApp
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
              <h3 className="font-display font-bold text-white mb-4">About</h3>
              <p className="text-sm">Your trusted marketplace for instant digital gift cards.</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Support</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Legal</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-white mb-4">Account</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">My Orders</a></li>
                <li><a href="#" className="hover:text-white transition">My Account</a></li>
                <li><a href="#" className="hover:text-white transition">Sign In</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Giftcards.Co. All rights reserved. | Powered by instant digital delivery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
