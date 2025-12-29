import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "/images/hero-slide-1.jpg",
    alt: "Elden Ring - Explora las Tierras Intermedias",
  },
  {
    id: 2,
    image: "/images/hero-slide-2.jpg",
    alt: "God of War Ragnarök - La saga nórdica continúa",
  },
  {
    id: 3,
    image: "/images/hero-slide-3.jpg",
    alt: "The Legend of Zelda: Tears of the Kingdom - Aventura épica",
  },
  {
    id: 4,
    image: "/images/hero-slide-4.jpg",
    alt: "Cyberpunk 2077 - Explora Night City",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
      {/* Carrusel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient para mejor legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>

      {/* Indicadores de navegación (dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Texto superpuesto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Tu Centro de Tarjetas de Regalo Digitales
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
            Entrega instantánea de PSN, Xbox, Nintendo, Amazon y más
          </p>
        </div>
      </div>
    </div>
  );
}
