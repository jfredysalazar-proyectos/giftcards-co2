import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { X, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Fetch WhatsApp number from settings
  const { data: whatsappSetting } = trpc.settings.get.useQuery({ key: "whatsapp_number" });
  const whatsappNumber = whatsappSetting?.value || "+573334315646";

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map(
        (item) =>
          `• ${item.productName} (${item.amount}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n");

    const message = `¡Hola Giftcards.Co! Quiero comprar:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsCheckingOut(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-display text-2xl font-bold">Tu Carrito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="text-sm">¡Agrega algunas tarjetas de regalo para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <img 
                    src={item.image} 
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600">{item.amount}</p>
                    <p className="text-sm font-semibold text-purple-600 mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-white rounded border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-2 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-lg">Total:</span>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleWhatsAppCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
              Comprar en WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              Limpiar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
