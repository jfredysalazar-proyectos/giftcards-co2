import { Link } from "wouter";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, CreditCard, Package, HelpCircle, Shield, Users, MessageCircle, FileText } from "lucide-react";

export default function HelpCenter() {
  const helpCategories = [
    {
      icon: ShoppingCart,
      title: "Cómo Comprar",
      description: "Guía paso a paso para realizar tu primera compra de tarjetas de regalo digitales",
      articles: [
        { title: "Crear una cuenta", content: "Regístrate en Giftcards.Co con tu correo electrónico o inicia sesión con tu cuenta existente. El registro es gratuito y te permite acceder a tu historial de pedidos y ofertas exclusivas." },
        { title: "Seleccionar productos", content: "Navega por nuestro catálogo de tarjetas de regalo. Usa los filtros por plataforma (PlayStation, Xbox, Nintendo, Amazon) y denominación para encontrar exactamente lo que necesitas." },
        { title: "Agregar al carrito", content: "Haz clic en 'Agregar al Carrito' en el producto deseado. Puedes continuar comprando o proceder al checkout. El carrito guarda tus productos automáticamente." },
        { title: "Completar el pago", content: "Revisa tu pedido, ingresa tu información de pago y confirma la compra. Aceptamos tarjetas de crédito/débito, PayPal, transferencias y criptomonedas." }
      ]
    },
    {
      icon: CreditCard,
      title: "Métodos de Pago",
      description: "Información sobre las opciones de pago disponibles y cómo procesamos tus transacciones",
      articles: [
        { title: "Tarjetas de crédito y débito", content: "Aceptamos Visa, Mastercard y American Express. Todos los pagos se procesan de forma segura a través de procesadores certificados PCI-DSS. Tu información financiera está completamente protegida con cifrado SSL/TLS." },
        { title: "PayPal", content: "Paga de forma rápida y segura con tu cuenta de PayPal. No necesitas compartir tu información bancaria con nosotros. El proceso es instantáneo y recibirás tu código inmediatamente después de la confirmación." },
        { title: "Transferencias bancarias", content: "Disponible para compras de mayor volumen. Contáctanos para recibir los datos bancarios. Una vez confirmada la transferencia, procesaremos tu pedido en un plazo máximo de 24 horas." },
        { title: "Criptomonedas", content: "Aceptamos Bitcoin, Ethereum y otras criptomonedas principales. El pago se procesa a través de nuestro proveedor de pagos cripto certificado. La confirmación puede tardar entre 10-30 minutos dependiendo de la red." }
      ]
    },
    {
      icon: Package,
      title: "Entrega y Canje",
      description: "Todo lo que necesitas saber sobre cómo recibir y usar tus códigos digitales",
      articles: [
        { title: "Tiempo de entrega", content: "La mayoría de los códigos se entregan instantáneamente por correo electrónico o WhatsApp. En casos excepcionales, puede tardar hasta 24 horas. Verifica tu carpeta de spam si no lo recibes de inmediato." },
        { title: "Canjear código PSN", content: "En PlayStation: Ve a PlayStation Store > Tu Avatar > Canjear Códigos > Ingresa el código de 12 dígitos > Confirma. El saldo se agregará a tu billetera PSN inmediatamente y podrás usarlo para comprar juegos, DLC o suscripciones." },
        { title: "Canjear código Xbox", content: "En Xbox: Presiona el botón Xbox > Canjear Código > Ingresa el código de 25 caracteres > Confirma. También puedes canjearlo en xbox.com/redeemcode. El crédito se reflejará en tu cuenta Microsoft instantáneamente." },
        { title: "Canjear código Nintendo", content: "En Nintendo Switch: Menú HOME > Nintendo eShop > Tu cuenta > Introducir Código > Ingresa el código de 16 dígitos > Confirma. Los fondos se agregarán a tu saldo de Nintendo eShop y podrás comprar juegos digitales inmediatamente." }
      ]
    },
    {
      icon: HelpCircle,
      title: "Problemas Comunes",
      description: "Soluciones rápidas a los problemas más frecuentes que enfrentan nuestros clientes",
      articles: [
        { title: "Código inválido o ya usado", content: "Si tu código no funciona, primero verifica que lo ingresaste correctamente sin espacios extras. Si el problema persiste, contáctanos inmediatamente por WhatsApp al +57 333 431 5646 con tu número de pedido y captura de pantalla del error. Verificaremos el código con nuestro proveedor y te proporcionaremos un reemplazo si es necesario." },
        { title: "No recibí mi código", content: "Verifica tu carpeta de spam o correo no deseado. Confirma que proporcionaste la dirección de correo correcta durante la compra. Si han pasado más de 24 horas, contáctanos con tu número de pedido y te reenviaremos el código inmediatamente." },
        { title: "Restricciones regionales", content: "Algunos códigos tienen restricciones geográficas impuestas por el emisor original. Verifica la descripción del producto antes de comprar para asegurarte de que el código funciona en tu región. Si compraste un código incompatible por error, contáctanos dentro de las 24 horas." },
        { title: "Problemas con la cuenta", content: "Si tu cuenta de PlayStation, Xbox o Nintendo tiene restricciones, suspensiones o baneos, no podrás canjear códigos. Estos problemas deben resolverse directamente con el proveedor de la plataforma. No somos responsables de restricciones impuestas por terceros." }
      ]
    },
    {
      icon: Shield,
      title: "Seguridad y Privacidad",
      description: "Cómo protegemos tu información personal y garantizamos transacciones seguras",
      articles: [
        { title: "Protección de datos", content: "Cumplimos con GDPR, CCPA y otras regulaciones de protección de datos. Tu información personal se almacena de forma segura con cifrado de nivel bancario. Nunca vendemos ni compartimos tu información con terceros sin tu consentimiento." },
        { title: "Seguridad de pagos", content: "Todos los pagos se procesan a través de proveedores certificados PCI-DSS. Utilizamos cifrado SSL/TLS para todas las transacciones. Nunca almacenamos información completa de tarjetas de crédito en nuestros servidores." },
        { title: "Autenticidad de códigos", content: "Todos nuestros códigos provienen de distribuidores autorizados oficiales. Verificamos cada código antes de la entrega para garantizar su validez. Trabajamos directamente con Sony, Microsoft, Nintendo, Amazon y otras marcas reconocidas." },
        { title: "Prevención de fraude", content: "Implementamos sistemas avanzados de detección de fraude para proteger tanto a clientes como a la plataforma. Podemos solicitar verificación adicional para compras de alto valor. Tu seguridad es nuestra prioridad número uno." }
      ]
    },
    {
      icon: Users,
      title: "Cuenta y Perfil",
      description: "Gestiona tu cuenta, historial de pedidos y preferencias personales",
      articles: [
        { title: "Crear y gestionar cuenta", content: "Regístrate con tu correo electrónico para acceder a beneficios exclusivos: historial de pedidos, recompra rápida, ofertas personalizadas y seguimiento de códigos. Puedes actualizar tu información en cualquier momento desde tu perfil." },
        { title: "Historial de pedidos", content: "Accede a todos tus pedidos anteriores desde tu panel de usuario. Puedes ver detalles de cada compra, descargar facturas y volver a acceder a códigos entregados. El historial se mantiene indefinidamente para tu conveniencia." },
        { title: "Recuperar contraseña", content: "Si olvidaste tu contraseña, haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Te enviaremos un enlace de recuperación a tu correo electrónico registrado. El enlace es válido por 24 horas por seguridad." },
        { title: "Eliminar cuenta", content: "Puedes solicitar la eliminación de tu cuenta en cualquier momento contactándonos. Eliminaremos toda tu información personal de acuerdo con las regulaciones de protección de datos. El historial de transacciones se conserva por requisitos legales." }
      ]
    }
  ];

  return (
    <>
      <AnnouncementBar />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">GC</span>
              </div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Giftcards.Co
              </h1>
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
            Centro de Ayuda
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Encuentra guías detalladas, tutoriales y respuestas a todas tus preguntas sobre Giftcards.Co
          </p>
        </div>
      </section>

      {/* Help Categories */}
      <section className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {helpCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Card key={idx} className="p-8 hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.articles.map((article, articleIdx) => (
                    <div key={articleIdx} className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition">
                      <h3 className="font-bold text-lg mb-3 text-gray-900">{article.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{article.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gradient-to-r from-purple-50 via-white to-cyan-50 py-12">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-8">Enlaces Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/faq">
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Preguntas Frecuentes</h3>
                  <p className="text-gray-600 text-sm">
                    Respuestas rápidas a las preguntas más comunes
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Contáctanos</h3>
                  <p className="text-gray-600 text-sm">
                    Habla con nuestro equipo de soporte
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/terms">
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Términos y Políticas</h3>
                  <p className="text-gray-600 text-sm">
                    Lee nuestros términos de servicio y políticas
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12">
        <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-12 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte está disponible para ayudarte. Contáctanos por WhatsApp para asistencia inmediata.
          </p>
          <a
            href="https://wa.me/573334315646?text=¡Hola%20Giftcards.Co!%20Necesito%20ayuda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="secondary" className="font-bold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chatear en WhatsApp
            </Button>
          </a>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container text-center">
          <p className="text-gray-400">© 2024 Giftcards.Co. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
