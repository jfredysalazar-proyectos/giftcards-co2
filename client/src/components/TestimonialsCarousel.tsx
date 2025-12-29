import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    avatar: "/images/testimonial-avatar-1.jpg",
    rating: 5,
    comment: "Excelente servicio! Recibí mi código de PSN en menos de 5 minutos. Totalmente confiable y rápido. Lo recomiendo 100%.",
    product: "PlayStation Network"
  },
  {
    id: 2,
    name: "Mei Chen",
    avatar: "/images/testimonial-avatar-2.jpg",
    rating: 5,
    comment: "La mejor experiencia comprando gift cards online. El proceso es súper fácil y el código llegó instantáneamente por WhatsApp. Volveré a comprar!",
    product: "Nintendo eShop"
  },
  {
    id: 3,
    name: "David Thompson",
    avatar: "/images/testimonial-avatar-3.jpg",
    rating: 5,
    comment: "Increíble atención al cliente. Tuve una duda y me respondieron al instante. El código de Xbox funcionó perfectamente. Muy profesionales!",
    product: "Xbox Gift Card"
  },
  {
    id: 4,
    name: "Aisha Williams",
    avatar: "/images/testimonial-avatar-4.jpg",
    rating: 5,
    comment: "Compré una Amazon Gift Card y todo perfecto. Entrega instantánea, precios competitivos y proceso seguro. Definitivamente mi tienda favorita!",
    product: "Amazon Gift Cards"
  },
  {
    id: 5,
    name: "Omar Hassan",
    avatar: "/images/testimonial-avatar-5.jpg",
    rating: 5,
    comment: "Servicio impecable! He comprado varias veces y siempre es la misma calidad. Códigos válidos, entrega rápida y excelente soporte.",
    product: "PlayStation Network"
  },
  {
    id: 6,
    name: "María González",
    avatar: "/images/testimonial-avatar-6.jpg",
    rating: 5,
    comment: "Me encanta! Es súper conveniente comprar desde casa y recibir el código al instante. Los precios son justos y el servicio es confiable.",
    product: "Nintendo eShop"
  }
];

export default function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="container py-16 bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Lo Que Dicen Nuestros Clientes
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Miles de clientes satisfechos confían en nosotros para sus compras de tarjetas de regalo digitales
        </p>
      </div>

      <div className="relative">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full border border-gray-100">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.comment}"
                  </p>

                  {/* Product */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 text-sm font-medium rounded-full">
                      {testimonial.product}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Cliente Verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={scrollPrev}
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          onClick={scrollNext}
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Trust Badge */}
      <div className="text-center mt-12">
        <p className="text-gray-600 font-medium">
          ⭐ <span className="font-bold text-gray-900">4.9/5</span> basado en más de{" "}
          <span className="font-bold text-gray-900">10,000+</span> reseñas verificadas
        </p>
      </div>
    </section>
  );
}
