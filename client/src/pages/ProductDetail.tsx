import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { CartModal } from "@/components/CartModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, MessageCircle, ShoppingCart, Star, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function ProductDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { addItem, items, isCartBouncing } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product, isLoading: productLoading } = trpc.products.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: amounts = [] } = trpc.products.getAmounts.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const { data: reviews = [] } = trpc.reviews.getByProduct.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const { data: productImages = [] } = trpc.products.getImages.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch WhatsApp number from settings
  const { data: whatsappSetting } = trpc.settings.get.useQuery({ key: "whatsapp_number" });
  const whatsappNumber = whatsappSetting?.value || "+573334315646";

  const utils = trpc.useUtils();
  const createReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.getByProduct.invalidate();
      setRating(5);
      setComment("");
      toast.success("¡Reseña enviada! Será visible después de la aprobación del administrador.");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleAmountChange = (value: string) => {
    const selectedAmountObj = amounts.find(a => a.amount === value);
    if (selectedAmountObj) {
      setSelectedAmount(value);
      setSelectedPrice(selectedAmountObj.price);
    }
  };

  const handleAddToCart = () => {
    if (!selectedAmount) {
      toast.error("Por favor selecciona un monto");
      return;
    }

    if (!product) return;

    addItem({
      id: `${product.id}-${selectedAmount}`,
      productId: product.id,
      productName: product.name,
      amount: selectedAmount,
      price: parseFloat(selectedPrice),
      quantity,
      image: product.image || "/images/placeholder.png",
    });

    toast.success("¡Producto agregado al carrito!");
  };

  const handleWhatsAppCheckout = () => {
    if (!selectedAmount) {
      toast.error("Por favor selecciona un monto");
      return;
    }

    const message = `¡Hola GiftCards Colombia! Quiero comprar:\n\n` +
      `🎮 Producto: ${product?.name}\n` +
      `💰 Monto: ${selectedAmount}\n` +
      `📦 Cantidad: ${quantity}\n` +
      `💵 Total: $${(parseFloat(selectedPrice) * quantity).toFixed(2)}\n\n` +
      `¿Pueden ayudarme con la compra?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (!product) return;

    createReviewMutation.mutate({
      productId: product.id,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const approvedReviews = reviews.filter(r => r.approved);
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${interactive ? "cursor-pointer" : ""} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className={`w-6 h-6 text-purple-600 ${isCartBouncing ? 'animate-cart-bounce' : ''}`} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Gallery */}
          <div>
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className={`h-96 bg-gradient-to-br ${product.gradient || "from-gray-400 to-gray-600"} relative`}>
                {(productImages.length > 0 ? productImages[selectedImageIndex]?.imageUrl : product.image) && (
                  <img
                    src={productImages.length > 0 ? productImages[selectedImageIndex]?.imageUrl : (product.image || "/images/placeholder.png")}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </Card>
            
            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {productImages.map((img, index) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      index === selectedImageIndex
                        ? "ring-4 ring-purple-500 scale-105"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`${product.name} - Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchase */}
          <div>
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-gray-600">
                    ({approvedReviews.length} reseñas)
                  </span>
                </div>
                {product.inStock ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    En Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                    Agotado
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.fullDescription || product.description}
              </p>
            </div>

            <Card className="p-6 border-2 border-purple-100">
              <h3 className="font-display text-xl font-bold mb-4">Selecciona tu Monto</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Monto de la Tarjeta</Label>
                  <Select value={selectedAmount} onValueChange={handleAmountChange}>
                    <SelectTrigger id="amount">
                      <SelectValue placeholder="Selecciona un monto" />
                    </SelectTrigger>
                    <SelectContent>
                      {amounts.map((amt) => (
                        <SelectItem key={amt.id} value={amt.amount}>
                          {amt.amount} - ${parseFloat(amt.price).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                {selectedPrice && (
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Total:</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        ${(parseFloat(selectedPrice) * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold py-6 text-sm sm:text-base lg:text-lg flex items-center justify-center whitespace-nowrap shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110 animate-pulse-slow animate-bounce-vertical"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || !selectedAmount}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0 relative z-10" />
                    <span className="truncate relative z-10">Agregar al Carrito</span>
                  </Button>
                  <Button
                    className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold py-6 text-sm sm:text-base lg:text-lg flex items-center justify-center whitespace-nowrap shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110 animate-pulse-slow animate-bounce-vertical"
                    onClick={handleWhatsAppCheckout}
                    disabled={!product.inStock || !selectedAmount}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0 relative z-10" />
                    <span className="truncate relative z-10">Comprar Ahora</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                  Entrega instantánea por WhatsApp
                </div>
              </div>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm font-semibold">Entrega Instantánea</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm font-semibold">100% Seguro</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm font-semibold">Múltiples Pagos</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">🎮</div>
                <p className="text-sm font-semibold">Códigos Válidos</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Existing Reviews */}
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">
              Reseñas de Clientes ({approvedReviews.length})
            </h2>
            
            {approvedReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">
                  Sé el primero en dejar una reseña para este producto.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Usuario #{review.userId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">Escribe una Reseña</h2>
            
            {!isAuthenticated ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Debes iniciar sesión para dejar una reseña
                </p>
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    Iniciar Sesión
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card className="p-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Tu Calificación</Label>
                    <div className="mt-2">
                      {renderStars(rating, true, setRating)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Tu Comentario (opcional)</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Comparte tu experiencia con este producto..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Reseña"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Tu reseña será revisada por un administrador antes de publicarse
                  </p>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="container text-center">
          <p className="text-sm">&copy; 2025 GiftCards Colombia. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
