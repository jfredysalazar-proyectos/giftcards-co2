import { Link } from "wouter";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
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

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Política de Reembolso</h1>
          <p className="text-gray-600 mb-8">Última actualización: Diciembre 2024</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Naturaleza de los Productos Digitales</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                GiftCards Colombia vende exclusivamente productos digitales en forma de códigos de tarjetas de regalo y códigos de prepago para diversas plataformas (PlayStation Network, Xbox, Nintendo eShop, Amazon, entre otras). Debido a la naturaleza instantánea y no recuperable de los productos digitales, nuestra política de reembolso está sujeta a condiciones específicas que se detallan a continuación.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al realizar una compra en nuestro sitio web, usted reconoce y acepta que está adquiriendo contenido digital que se entrega electrónicamente y que, una vez revelado el código, el producto se considera entregado y utilizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Política General de Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Como regla general, debido a la naturaleza de los productos digitales que vendemos, <strong>no ofrecemos reembolsos una vez que el código ha sido entregado y revelado al cliente</strong>. Esta política es estándar en la industria de productos digitales y está alineada con las directrices de las principales plataformas de comercio electrónico.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sin embargo, reconocemos que pueden surgir circunstancias excepcionales, y evaluaremos cada solicitud de reembolso de manera individual según los criterios establecidos en esta política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Circunstancias Elegibles para Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Consideraremos solicitudes de reembolso en las siguientes circunstancias específicas:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Código Inválido o Ya Utilizado</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si el código que recibió es inválido, ya ha sido utilizado por otra persona, o no puede ser canjeado por razones técnicas atribuibles a nosotros, tiene derecho a un reembolso completo o a un reemplazo del código. Debe reportar este problema dentro de las 48 horas posteriores a la recepción del código.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para procesar su solicitud, necesitaremos evidencia del problema, como capturas de pantalla del mensaje de error al intentar canjear el código. Verificaremos la validez del código con nuestros proveedores antes de procesar el reembolso.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Producto Incorrecto Entregado</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si recibió un código para un producto diferente al que ordenó (por ejemplo, ordenó PlayStation Network pero recibió Xbox), tiene derecho a un reembolso completo o al código correcto. Esta situación debe reportarse dentro de las 24 horas posteriores a la recepción del código.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Cargo Duplicado</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si se le cobró más de una vez por la misma transacción debido a un error en nuestro sistema de procesamiento de pagos, reembolsaremos inmediatamente el cargo duplicado. Esto generalmente se resuelve dentro de 3-5 días hábiles, dependiendo de su institución financiera.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.4 No Recepción del Código</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si completó su compra pero no recibió el código dentro del tiempo de entrega prometido (generalmente inmediato o hasta 24 horas), y hemos confirmado que el pago fue procesado exitosamente, le proporcionaremos el código inmediatamente o procesaremos un reembolso completo a su elección.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Antes de solicitar un reembolso por no recepción, verifique su carpeta de spam o correo no deseado, y asegúrese de que proporcionó la dirección de correo electrónico o número de WhatsApp correctos durante la compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Circunstancias NO Elegibles para Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                No ofrecemos reembolsos en las siguientes situaciones:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Cambio de Opinión</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Una vez que el código ha sido entregado y revelado, no aceptamos solicitudes de reembolso basadas en cambio de opinión, compra accidental o decisión de no utilizar el código. Le recomendamos revisar cuidadosamente su pedido antes de completar la compra.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Restricciones Regionales</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si el código no funciona en su región debido a restricciones geográficas impuestas por el emisor original (PlayStation, Xbox, Nintendo, etc.), y esta información estaba claramente indicada en la descripción del producto al momento de la compra, no ofrecemos reembolsos. Es responsabilidad del cliente verificar la compatibilidad regional antes de realizar la compra.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Incompatibilidad de Plataforma</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si adquirió un código para una plataforma incorrecta (por ejemplo, compró un código de Xbox cuando necesitaba PlayStation), no ofrecemos reembolsos una vez que el código ha sido entregado. Asegúrese de seleccionar el producto correcto para su plataforma antes de completar la compra.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Problemas con la Cuenta del Usuario</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                No somos responsables de problemas relacionados con su cuenta en las plataformas de terceros (PlayStation Network, Xbox Live, Nintendo eShop, etc.), incluyendo cuentas suspendidas, baneadas o con restricciones que impidan el canje del código. Estos problemas deben resolverse directamente con el proveedor de la plataforma.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.5 Código Ya Canjeado por el Cliente</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si usted ya canjeó exitosamente el código en su cuenta, no ofrecemos reembolsos. Una vez que el código ha sido aplicado a una cuenta, el valor ya ha sido transferido y no puede ser revertido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Proceso de Solicitud de Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si cree que califica para un reembolso según los criterios establecidos anteriormente, siga estos pasos:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Paso 1: Contacte a Nuestro Equipo de Soporte</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Comuníquese con nuestro equipo de atención al cliente dentro del plazo especificado para su situación (generalmente 24-48 horas desde la recepción del código) a través de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li><strong>WhatsApp:</strong> +57 333 431 5646</li>
                <li><strong>Correo electrónico:</strong> soporte@giftcards.co</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Paso 2: Proporcione Información Detallada</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                En su solicitud, incluya la siguiente información:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Número de pedido o ID de transacción</li>
                <li>Fecha y hora de la compra</li>
                <li>Descripción detallada del problema</li>
                <li>Capturas de pantalla o evidencia del problema (si aplica)</li>
                <li>Código recibido (para verificación, no lo comparta públicamente)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Paso 3: Evaluación de la Solicitud</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestro equipo revisará su solicitud dentro de 1-3 días hábiles. Verificaremos la validez del código con nuestros proveedores y evaluaremos si su situación cumple con los criterios de elegibilidad para reembolso.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Paso 4: Resolución</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si su solicitud es aprobada, procesaremos el reembolso o proporcionaremos un código de reemplazo según su preferencia. Si su solicitud es denegada, le explicaremos las razones y, cuando sea posible, ofreceremos soluciones alternativas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Métodos y Tiempos de Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los reembolsos aprobados se procesarán utilizando el mismo método de pago que utilizó para la compra original. Los tiempos de procesamiento varían según el método de pago:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Método de Pago</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Tiempo de Procesamiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Tarjeta de Crédito/Débito</td>
                      <td className="border border-gray-300 px-4 py-3">5-10 días hábiles</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">PayPal</td>
                      <td className="border border-gray-300 px-4 py-3">3-5 días hábiles</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Transferencia Bancaria</td>
                      <td className="border border-gray-300 px-4 py-3">7-14 días hábiles</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">Criptomonedas</td>
                      <td className="border border-gray-300 px-4 py-3">1-3 días hábiles</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Tenga en cuenta que estos son tiempos estimados y pueden variar según su institución financiera. Una vez que procesemos el reembolso desde nuestro lado, el tiempo que tarde en reflejarse en su cuenta depende de su banco o proveedor de pago.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Reembolsos Parciales</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En circunstancias excepcionales, podemos ofrecer reembolsos parciales en lugar de reembolsos completos. Esto puede ocurrir cuando:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>El código funcionó parcialmente pero no proporcionó el valor completo prometido</li>
                <li>Hubo un error en el precio o la denominación del código</li>
                <li>Se aplicó un descuento o promoción incorrecta</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                El monto del reembolso parcial se determinará caso por caso, basándose en la naturaleza específica del problema y el valor que el cliente ya haya recibido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Crédito de la Tienda como Alternativa</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En algunos casos, podemos ofrecer crédito de la tienda como alternativa al reembolso monetario. El crédito de la tienda puede usarse para futuras compras en GiftCards Colombia y generalmente se procesa más rápidamente que los reembolsos tradicionales.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                El crédito de la tienda no tiene fecha de vencimiento y puede aplicarse a cualquier producto disponible en nuestro sitio. Si acepta el crédito de la tienda, se agregará automáticamente a su cuenta y podrá verlo en su panel de usuario.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Prevención de Fraude</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos tomamos muy en serio la prevención del fraude. Nos reservamos el derecho de investigar y denegar solicitudes de reembolso que consideremos sospechosas o fraudulentas. Esto puede incluir:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Múltiples solicitudes de reembolso del mismo cliente</li>
                <li>Patrones de compra inusuales</li>
                <li>Evidencia de que el código fue canjeado exitosamente</li>
                <li>Información contradictoria o falsa en la solicitud</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si detectamos actividad fraudulenta, podemos suspender o cerrar permanentemente la cuenta del usuario y reportar el incidente a las autoridades correspondientes. También podemos compartir información sobre actividades fraudulentas con otras plataformas y servicios de prevención de fraude.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Disputas y Contracargos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tiene un problema con su compra, le instamos a contactarnos directamente antes de iniciar una disputa o contracargo con su banco o compañía de tarjeta de crédito. Estamos comprometidos a resolver cualquier problema de manera justa y rápida.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los contracargos no autorizados (cuando el cliente inicia una disputa sin contactarnos primero) pueden resultar en:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Suspensión inmediata de la cuenta</li>
                <li>Prohibición de futuras compras</li>
                <li>Acciones legales para recuperar el valor del producto entregado</li>
                <li>Reporte a agencias de prevención de fraude</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si su banco o compañía de tarjeta inicia un contracargo, proporcionaremos toda la evidencia de la transacción, entrega del producto y comunicaciones con el cliente para defender la legitimidad de la venta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Excepciones y Discreción de la Empresa</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aunque esta política establece nuestras directrices generales de reembolso, nos reservamos el derecho de hacer excepciones a nuestra discreción en circunstancias extraordinarias. Cada situación se evaluará individualmente, considerando factores como:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Historial del cliente con nuestra empresa</li>
                <li>Naturaleza y gravedad del problema</li>
                <li>Esfuerzos del cliente para resolver el problema</li>
                <li>Impacto en la relación comercial a largo plazo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Modificaciones a esta Política</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos reservamos el derecho de modificar esta Política de Reembolso en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. Le recomendamos revisar esta política periódicamente para estar informado sobre nuestras prácticas actuales de reembolso.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las compras realizadas antes de cualquier cambio en la política estarán sujetas a la política vigente en el momento de la compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contacto</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para solicitar un reembolso o si tiene preguntas sobre esta política, puede contactarnos a través de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>WhatsApp:</strong> +57 333 431 5646</li>
                <li><strong>Correo electrónico:</strong> soporte@giftcards.co</li>
                <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (hora local)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                Nuestro equipo de soporte está capacitado para manejar solicitudes de reembolso de manera profesional y eficiente. Nos esforzamos por responder a todas las consultas dentro de 24 horas durante días hábiles.
              </p>
            </section>
          </div>
        </div>
      </div>

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
