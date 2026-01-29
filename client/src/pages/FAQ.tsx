import { Button } from "@/components/ui/button";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function FAQ() {
  const { data: faqs = [], isLoading } = trpc.faqs.list.useQuery();

  // Schema.org JSON-LD para SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SEO
        title="Preguntas Frecuentes | GiftCards Colombia"
        description="Encuentra respuestas rápidas a las preguntas más comunes sobre tarjetas de regalo digitales en Colombia. Compra, canje, métodos de pago y más."
        keywords="preguntas frecuentes, FAQ, ayuda, soporte, tarjetas de regalo Colombia, gift cards"
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <AnnouncementBar />
      <div className="min-h-screen bg-gray-50">
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
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-600 py-16 text-white">
        <div className="container text-center">
          <h1 className="font-display text-5xl font-bold mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestras tarjetas de regalo digitales
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : faqs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              No hay preguntas frecuentes disponibles en este momento.
            </p>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={faq.id} className="border-0 shadow-md overflow-hidden">
                  <AccordionItem value={`item-${index}`} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition">
                      <span className="text-left font-semibold text-gray-900">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-50 via-white to-cyan-50 py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            ¿Aún tienes preguntas?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte está disponible para ayudarte. Contáctanos por WhatsApp y te responderemos de inmediato.
          </p>
          <a
            href="https://wa.me/1234567890?text=¡Hola%20GiftCards Colombia!%20Tengo%20una%20pregunta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg transition shadow-lg hover:shadow-xl"
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
                <li><a href="#" className="hover:text-white transition">Mis Pedidos</a></li>
                <li><a href="#" className="hover:text-white transition">Iniciar Sesión</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 GiftCards Colombia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
