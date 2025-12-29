import { Link } from "wouter";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Mensaje enviado exitosamente. Te responderemos pronto!");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <AnnouncementBar />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img 
                src="/logo-giftcards-colombia.webp" 
                alt="GiftCards Colombia" 
                className="h-12 w-auto"
              />
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-600 py-16 text-white">
        <div className="container text-center">
          <h1 className="font-display text-5xl font-bold mb-4">
            Contáctanos
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Chatea con nosotros directamente para respuestas inmediatas
                  </p>
                  <a
                    href="https://wa.me/573334315646?text=¡Hola%20GiftCards Colombia!%20Necesito%20ayuda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    +57 333 431 5646
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Correo Electrónico</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Envíanos un correo y te responderemos en 24 horas
                  </p>
                  <a
                    href="mailto:soporte@giftcards.co"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    soporte@giftcards.co
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Horario de Atención</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Lunes a Viernes:</strong><br />
                    9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>WhatsApp 24/7:</strong><br />
                    Respondemos fuera de horario
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Ubicación</h3>
                  <p className="text-gray-600 text-sm">
                    Servicio digital en toda Latinoamérica<br />
                    Entrega instantánea global
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Nombre Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Correo Electrónico *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    Asunto *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Mensaje *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe tu consulta o problema en detalle..."
                    required
                    rows={6}
                    className="w-full resize-none"
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Para soporte urgente, te recomendamos contactarnos directamente por WhatsApp al{" "}
                    <a
                      href="https://wa.me/573334315646"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      +57 333 431 5646
                    </a>
                    {" "}para recibir asistencia inmediata.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 text-lg"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </Card>

            {/* FAQ Link */}
            <Card className="p-6 mt-6 bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">¿Tienes una pregunta común?</h3>
                  <p className="text-gray-600 text-sm">
                    Revisa nuestras preguntas frecuentes para encontrar respuestas rápidas
                  </p>
                </div>
                <Link href="/faq">
                  <Button variant="outline" className="ml-4">
                    Ver FAQs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container text-center">
          <p className="text-gray-400">© 2024 GiftCards Colombia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
