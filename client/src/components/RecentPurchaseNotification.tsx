import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

// Nombres colombianos comunes
const colombianNames = [
  'Isabella', 'Sofía', 'Valentina', 'Camila', 'Mariana',
  'Daniela', 'Gabriela', 'Valeria', 'Natalia', 'Paula',
  'Carlos', 'Juan', 'Andrés', 'Felipe', 'Santiago',
  'Sebastián', 'Miguel', 'Diego', 'Alejandro', 'Mateo',
  'Laura', 'María', 'Ana', 'Catalina', 'Carolina',
  'Juliana', 'Andrea', 'Melissa', 'Alejandra', 'Paola'
];

// Ciudades capitales de Colombia
const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Cúcuta', 'Ibagué',
  'Manizales', 'Villavicencio', 'Pasto', 'Neiva', 'Armenia',
  'Popayán', 'Montería', 'Valledupar', 'Sincelejo', 'Tunja'
];

interface Product {
  id: string;
  name: string;
  image: string | null;
}

interface RecentPurchaseNotificationProps {
  products: Product[];
}

export default function RecentPurchaseNotification({ products }: RecentPurchaseNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<{
    name: string;
    product: Product;
    city: string;
  } | null>(null);

  useEffect(() => {
    if (products.length === 0) return;

    // Función para generar una compra aleatoria
    const generateRandomPurchase = () => {
      const randomName = colombianNames[Math.floor(Math.random() * colombianNames.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomCity = colombianCities[Math.floor(Math.random() * colombianCities.length)];

      return {
        name: randomName,
        product: randomProduct,
        city: randomCity
      };
    };

    // Mostrar notificación cada 8 segundos
    const interval = setInterval(() => {
      setCurrentPurchase(generateRandomPurchase());
      setIsVisible(true);

      // Ocultar después de 5 segundos
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 8000);

    // Mostrar la primera notificación después de 3 segundos
    setTimeout(() => {
      setCurrentPurchase(generateRandomPurchase());
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  if (!currentPurchase || !isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
      style={{
        animation: isVisible ? 'slideIn 0.5s ease-out' : 'slideOut 0.5s ease-in'
      }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          {currentPurchase.product.image ? (
            <img
              src={currentPurchase.product.image}
              alt={currentPurchase.product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {currentPurchase.product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Información de la compra */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {currentPurchase.name}
          </p>
          <p className="text-xs text-gray-600 truncate">
            Compró <span className="font-medium">{currentPurchase.product.name}</span>
          </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-purple-600" />
            <p className="text-xs text-gray-500">
              Desde: <span className="font-medium text-purple-600">{currentPurchase.city}</span>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Hoy</p>
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 bg-gray-100 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          style={{
            animation: 'progress 5s linear'
          }}
        />
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
