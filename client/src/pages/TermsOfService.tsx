import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
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

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Términos y Condiciones</h1>
          <p className="text-gray-600 mb-8">Última actualización: Diciembre 2024</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al acceder y utilizar el sitio web de Giftcards.Co (en adelante, "el Sitio"), usted acepta estar sujeto a estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de todas las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Giftcards.Co es una plataforma de comercio electrónico que facilita la venta de tarjetas de regalo digitales y códigos de prepago para diversas plataformas de entretenimiento, incluyendo pero no limitado a PlayStation Network, Xbox, Nintendo eShop, Amazon y otras marcas reconocidas. Todos los productos ofrecidos son códigos digitales que se entregan electrónicamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Registro y Cuenta de Usuario</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para realizar compras en nuestro Sitio, puede ser necesario crear una cuenta de usuario. Usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña, y es totalmente responsable de todas las actividades que ocurran bajo su cuenta. Se compromete a notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al registrarse, usted garantiza que toda la información proporcionada es precisa, actual y completa. Nos reservamos el derecho de suspender o cancelar su cuenta si se descubre que la información proporcionada es inexacta, falsa o incompleta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Proceso de Compra y Pago</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al realizar un pedido a través de nuestro Sitio, usted acepta proporcionar información de compra y cuenta actual, completa y precisa para todas las compras realizadas. Usted acepta actualizar rápidamente su cuenta y otra información, incluyendo su dirección de correo electrónico y números de tarjetas de crédito y fechas de vencimiento, para que podamos completar sus transacciones y contactarlo según sea necesario.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los precios de todos los productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o descontinuar cualquier producto en cualquier momento sin previo aviso. No seremos responsables ante usted o cualquier tercero por cualquier modificación, cambio de precio, suspensión o discontinuación del producto.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos reservamos el derecho de rechazar cualquier pedido que realice con nosotros. Podemos, a nuestra entera discreción, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Estas restricciones pueden incluir pedidos realizados por o bajo la misma cuenta de cliente, la misma tarjeta de crédito y/o pedidos que utilizan la misma dirección de facturación o envío.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Entrega de Productos Digitales</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos los productos vendidos en Giftcards.Co son códigos digitales que se entregan electrónicamente. La entrega se realiza mediante correo electrónico o WhatsApp a la información de contacto proporcionada durante el proceso de compra. El tiempo de entrega típico es inmediato o dentro de las 24 horas posteriores a la confirmación del pago.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Es su responsabilidad proporcionar una dirección de correo electrónico válida y accesible. No somos responsables de retrasos en la entrega causados por información de contacto incorrecta o inaccesible proporcionada por el cliente.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Una vez que el código digital ha sido entregado y revelado al cliente, se considera que el producto ha sido entregado exitosamente. Es responsabilidad del cliente guardar y proteger el código recibido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Uso de Códigos y Restricciones</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los códigos digitales vendidos están sujetos a los términos y condiciones del emisor original (PlayStation, Xbox, Nintendo, Amazon, etc.). Cada código puede tener restricciones geográficas, de plataforma o de uso específicas establecidas por el emisor.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los códigos son para uso personal y no pueden ser revendidos, transferidos o utilizados con fines comerciales sin autorización expresa. El uso fraudulento o abusivo de los códigos puede resultar en la cancelación de su cuenta y acciones legales.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                No somos responsables de códigos que no puedan ser canjeados debido a restricciones regionales, incompatibilidad de plataforma o políticas del emisor, siempre que hayamos proporcionado la información correcta del producto en el momento de la compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Propiedad Intelectual</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                El contenido del Sitio, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Giftcards.Co o de sus proveedores de contenido y está protegido por las leyes de derechos de autor internacionales.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las marcas comerciales, logotipos y marcas de servicio mostradas en el Sitio (PlayStation, Xbox, Nintendo, Amazon, etc.) son propiedad de sus respectivos dueños. Giftcards.Co es un revendedor autorizado y no reclama propiedad sobre estas marcas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En ningún caso Giftcards.Co, sus directores, empleados o agentes serán responsables ante usted o cualquier tercero por daños indirectos, consecuentes, ejemplares, incidentales, especiales o punitivos, incluyendo pérdida de beneficios, pérdida de ingresos, pérdida de datos u otros daños intangibles, que surjan de su uso del Sitio o de los productos adquiridos.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestra responsabilidad total hacia usted por cualquier reclamo relacionado con el uso del Sitio o los productos comprados no excederá el monto que usted pagó por el producto específico en cuestión.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnización</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Usted acepta indemnizar, defender y mantener indemne a Giftcards.Co y a sus subsidiarias, afiliadas, socios, funcionarios, directores, agentes, contratistas, licenciantes, proveedores de servicios, subcontratistas, proveedores, pasantes y empleados, de cualquier reclamo o demanda, incluidos los honorarios razonables de abogados, realizados por cualquier tercero debido a o que surja de su incumplimiento de estos Términos y Condiciones o de los documentos que incorporan por referencia, o de su violación de cualquier ley o de los derechos de un tercero.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Modificaciones de los Términos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos reservamos el derecho, a nuestra entera discreción, de actualizar, cambiar o reemplazar cualquier parte de estos Términos y Condiciones publicando actualizaciones y cambios en nuestro sitio web. Es su responsabilidad revisar periódicamente nuestro sitio web para ver los cambios. Su uso continuado o acceso a nuestro sitio web o el Servicio después de la publicación de cualquier cambio en estos Términos y Condiciones constituye la aceptación de esos cambios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Ley Aplicable y Jurisdicción</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja de o relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>WhatsApp: +57 333 431 5646</li>
                <li>Correo electrónico: soporte@giftcards.co</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container text-center">
          <p className="text-gray-400">© 2024 Giftcards.Co. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
