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
    name: "PlayStation Network Gift Card",
    category: "Gaming",
    description: "Add funds to your PlayStation Network account and unlock a world of games, add-ons, and entertainment.",
    fullDescription: `PlayStation Network Gift Cards are the perfect way to enhance your gaming experience. Whether you're looking to purchase the latest AAA titles, indie gems, or premium add-ons for your favorite games, PSN cards have you covered. With instant delivery, you can start playing within minutes.

Features:
• Instant digital delivery
• Works on PS4, PS5, and PSN account
• No expiration date
• Secure and verified
• 24/7 customer support`,
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
        text: "Received my PSN card instantly! Great service.",
      },
      {
        author: "Jordan M.",
        rating: 5,
        text: "Fast and reliable. Highly recommended!",
      },
      {
        author: "Casey T.",
        rating: 4,
        text: "Good experience, smooth checkout process.",
      },
    ],
  };

  const handleDownloadPreview = () => {
    // Simulate preview download
    alert("Preview downloaded! Check your downloads folder.");
  };

  const handleWhatsAppCheckout = () => {
    const message = `Hi Giftcards.Co! I want to buy ${quantity}x ${product.name} (${selectedAmount}) for a total of $${quantity * parseFloat(selectedAmount.replace("$", ""))}.`;
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
              Download Preview
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
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>
                {product.inStock && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <Check className="w-5 h-5" />
                    In Stock
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-lg mb-6">{product.description}</p>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Select Amount</h3>
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
              <h3 className="font-display font-bold text-lg mb-4">Quantity</h3>
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
                <span className="text-gray-700">Delivery:</span>
                <span className="font-semibold text-green-600">Instant</span>
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
              {isAddingToCart ? "Added to Cart!" : "Add to Cart"}
            </button>

            {/* WhatsApp Checkout */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
            >
              <MessageCircle className="w-6 h-6" />
              Direct WhatsApp Checkout
            </button>

            <p className="text-center text-sm text-gray-600">
              Add to cart or checkout directly on WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="bg-gray-50 py-12">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-6">About This Product</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {product.fullDescription}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-12">
        <h2 className="font-display text-3xl font-bold mb-8">Customer Reviews</h2>
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
            <p>&copy; 2025 Giftcards.Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
