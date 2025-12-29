import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { MessageCircle, Download, Check, Star, ShoppingCart } from "lucide-react";
import type { RouteComponentProps } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Playful Gradient Grid
 * - Product detail page with preview image and gradient background
 * - Instant download button for digital preview
 * - WhatsApp checkout integration
 * - Testimonials and ratings section
 */

export default function ProductDetail({ params }: RouteComponentProps<{ id: string }>) {
  const id = params?.id || "psn-1";
  const { addItem } = useCart();
  const [, setLocation] = useLocation();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState("$25");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mock product data
  const product = {
    id,
    name: "Tarjeta de Regalo PlayStation Network",
    category: "Videojuegos",
    description: "Agrega fondos a tu cuenta de PlayStation Network y desbloquea un mundo de juegos, complementos y entretenimiento.",
    fullDescription: `Las Tarjetas de Regalo de PlayStation Network son la forma perfecta de mejorar tu experiencia de juego. Ya sea que busques comprar los últimos títulos AAA, gemas indie o complementos premium para tus juegos favoritos, las tarjetas PSN te cubren. Con entrega instantánea, puedes comenzar a jugar en minutos.

Características:
• Entrega digital instantánea
• Funciona en PS4, PS5 y cuenta PSN
• Sin fecha de vencimiento
• Seguro y verificado
• Soporte al cliente 24/7`,
    image: "/images/product-category-psn.png",
    gradient: "from-purple-700 to-purple-500",
    amounts: ["$10", "$25", "$50", "$100"],
    basePrice: 25,
    rating: 4.8,
    reviews: 1250,
    inStock: true,
    testimonials: [
      {
        author: "Alex G.",
        rating: 5,
        text: "¡Recibí mi tarjeta PSN al instante! Excelente servicio.",
      },
      {
        author: "Jordan M.",
        rating: 5,
        text: "Rápido y confiable. ¡Altamente recomendado!",
      },
      {
        author: "Casey T.",
        rating: 4,
        text: "Buena experiencia, proceso de compra fluido.",
      },
    ],
  };

  const handleDownloadPreview = () => {
    // Simulate preview download
    alert("¡Vista previa descargada! Revisa tu carpeta de descargas.");
  };

  const handleWhatsAppCheckout = () => {
    const message = `¡Hola Giftcards.Co! Quiero comprar ${quantity}x ${product.name} (${selectedAmount}) por un total de $${quantity * parseFloat(selectedAmount.replace("$", ""))}.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">GC</span>
            </div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Giftcards.Co
            </h1>
          </a>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image & Preview */}
          <div>
            <div className={`bg-gradient-to-br ${product.gradient} rounded-2xl overflow-hidden shadow-2xl mb-6`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <Button
              onClick={handleDownloadPreview}
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar Vista Previa
            </Button>
          </div>

          {/* Product Details & Checkout */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                {product.category}
              </span>
              <h1 className="font-display text-4xl font-bold mb-4 text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-gray-600">({product.reviews} reseñas)</span>
                </div>
                {product.inStock && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <Check className="w-5 h-5" />
                    En Stock
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-lg mb-6">{product.description}</p>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Selecciona Monto</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-4 px-4 rounded-lg font-bold transition border-2 ${
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-purple-600"
                        : "bg-white text-gray-900 border-gray-200 hover:border-purple-600"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Cantidad</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 border-0 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  ${quantity * parseFloat(selectedAmount.replace("$", ""))}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Entrega:</span>
                <span className="font-semibold text-green-600">Instantánea</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-display font-bold text-lg">Total:</span>
                <span className="font-display text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  ${quantity * parseFloat(selectedAmount.replace("$", ""))}
                </span>
              </div>
            </Card>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                const price = parseFloat(selectedAmount.replace("$", ""));
                addItem({
                  id: `${product.id}-${selectedAmount}`,
                  productName: product.name,
                  amount: selectedAmount,
                  quantity,
                  price,
                });
                setIsAddingToCart(true);
                setTimeout(() => {
                  setIsAddingToCart(false);
                  setLocation("/");
                }, 1500);
              }}
              disabled={isAddingToCart}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
            >
              <ShoppingCart className="w-6 h-6" />
              {isAddingToCart ? "¡Agregado al Carrito!" : "Agregar al Carrito"}
            </button>

            {/* WhatsApp Checkout */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
            >
              <MessageCircle className="w-6 h-6" />
              Comprar Directamente en WhatsApp
            </button>

            <p className="text-center text-sm text-gray-600">
              Agrega al carrito o compra directamente en WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="bg-gray-50 py-12">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-6">Acerca de este Producto</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {product.fullDescription}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-12">
        <h2 className="font-display text-3xl font-bold mb-8">Reseñas de Clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900">— {testimonial.author}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
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
            <p>&copy; 2025 Giftcards.Co. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
