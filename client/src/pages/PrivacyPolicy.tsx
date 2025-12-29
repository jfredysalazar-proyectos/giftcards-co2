import { Link } from "wouter";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-gray-600 mb-8">Última actualización: Diciembre 2024</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En GiftCards Colombia, nos comprometemos a proteger su privacidad y garantizar la seguridad de su información personal. Esta Política de Privacidad describe cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web y utiliza nuestros servicios. Al utilizar nuestro sitio, usted acepta las prácticas descritas en esta política.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Esta política cumple con el Reglamento General de Protección de Datos (GDPR) de la Unión Europea, la Ley de Privacidad del Consumidor de California (CCPA) y otras leyes de protección de datos aplicables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Información Personal que Usted Proporciona</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Recopilamos información personal que usted nos proporciona voluntariamente cuando se registra en el sitio, realiza una compra, se suscribe a nuestro boletín informativo o se comunica con nosotros. Esta información puede incluir:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono (WhatsApp)</li>
                <li>Información de pago (procesada de forma segura por proveedores externos)</li>
                <li>Historial de compras y preferencias de productos</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Información Recopilada Automáticamente</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cuando visita nuestro sitio web, recopilamos automáticamente cierta información sobre su dispositivo y su interacción con nuestro sitio, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Dirección IP y ubicación geográfica aproximada</li>
                <li>Tipo de navegador y versión</li>
                <li>Sistema operativo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Fuente de referencia (cómo llegó a nuestro sitio)</li>
                <li>Cookies y tecnologías de seguimiento similares</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Información de Terceros</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos recibir información sobre usted de fuentes de terceros, como proveedores de servicios de pago, plataformas de redes sociales (si elige conectar su cuenta) y servicios de análisis web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Procesamiento de Transacciones</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Procesamos su información personal para completar sus compras, entregar códigos digitales, procesar pagos y proporcionar confirmaciones de pedidos. Esta es la base legal principal para el procesamiento de sus datos bajo el GDPR (ejecución de contrato).
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Comunicación con el Cliente</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos su información de contacto para enviarle actualizaciones sobre sus pedidos, responder a sus consultas, proporcionar soporte técnico y enviar notificaciones importantes sobre cambios en nuestros servicios o políticas.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Marketing y Promociones</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Con su consentimiento explícito, podemos enviarle correos electrónicos promocionales sobre nuevos productos, ofertas especiales y actualizaciones. Siempre puede optar por no recibir estas comunicaciones haciendo clic en el enlace de cancelación de suscripción en cualquier correo electrónico o contactándonos directamente.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Mejora del Servicio</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Analizamos datos agregados y anónimos para comprender cómo los usuarios interactúan con nuestro sitio, identificar tendencias, mejorar la funcionalidad del sitio web y desarrollar nuevas características y servicios.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.5 Prevención de Fraude y Seguridad</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos su información para detectar, prevenir y responder a actividades fraudulentas, abuso, violaciones de seguridad y otras actividades potencialmente prohibidas o ilegales. Este procesamiento se basa en nuestro interés legítimo en proteger nuestro negocio y a nuestros clientes.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.6 Cumplimiento Legal</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos procesar su información personal cuando sea necesario para cumplir con obligaciones legales, responder a solicitudes legales de autoridades públicas y proteger nuestros derechos legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Compartir Información con Terceros</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                No vendemos, alquilamos ni comercializamos su información personal a terceros. Sin embargo, podemos compartir su información con las siguientes categorías de terceros:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Proveedores de Servicios</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Compartimos información con proveedores de servicios externos que nos ayudan a operar nuestro negocio, incluyendo procesadores de pagos, servicios de hosting web, proveedores de email marketing, servicios de análisis y soporte al cliente. Estos proveedores están obligados contractualmente a proteger su información y solo pueden usarla para los fines específicos para los que fueron contratados.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Socios Comerciales</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Trabajamos con distribuidores autorizados de códigos digitales (PlayStation, Xbox, Nintendo, Amazon, etc.) para cumplir con sus pedidos. Compartimos únicamente la información necesaria para procesar y entregar su compra.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Cumplimiento Legal y Protección</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos divulgar su información si creemos de buena fe que dicha divulgación es necesaria para: (a) cumplir con una obligación legal; (b) proteger y defender nuestros derechos o propiedad; (c) prevenir o investigar posibles irregularidades relacionadas con el servicio; (d) proteger la seguridad personal de los usuarios del servicio o del público.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Transferencias Comerciales</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                En el caso de una fusión, adquisición, reorganización o venta de activos, su información personal puede ser transferida como parte de esa transacción. Le notificaremos mediante un aviso destacado en nuestro sitio web sobre cualquier cambio en la propiedad o uso de su información personal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies y Tecnologías de Seguimiento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías de seguimiento similares para mejorar su experiencia en nuestro sitio web. Las cookies son pequeños archivos de datos que se almacenan en su dispositivo cuando visita un sitio web.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Tipos de Cookies que Utilizamos</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio, como mantener su sesión de usuario y carrito de compras.</li>
                <li><strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio recopilando información anónima sobre páginas visitadas y errores encontrados.</li>
                <li><strong>Cookies de Funcionalidad:</strong> Permiten que el sitio recuerde sus elecciones (como idioma o región) y proporcionen características mejoradas y más personales.</li>
                <li><strong>Cookies de Marketing:</strong> Utilizadas para rastrear visitantes en sitios web con el propósito de mostrar anuncios relevantes y atractivos para el usuario individual.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Gestión de Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando los sitios web establecen o acceden a cookies. Sin embargo, si deshabilita o rechaza las cookies, tenga en cuenta que algunas partes de nuestro sitio pueden volverse inaccesibles o no funcionar correctamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Seguridad de los Datos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Cifrado SSL/TLS para todas las transmisiones de datos</li>
                <li>Almacenamiento seguro de datos con acceso restringido</li>
                <li>Revisiones regulares de seguridad y auditorías</li>
                <li>Capacitación del personal en prácticas de protección de datos</li>
                <li>Uso de proveedores de pago certificados PCI-DSS</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por utilizar medios comercialmente aceptables para proteger su información personal, no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Retenemos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta Política de Privacidad, a menos que la ley requiera o permita un período de retención más largo. Los criterios utilizados para determinar nuestros períodos de retención incluyen:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>El tiempo que mantiene una cuenta activa con nosotros</li>
                <li>La necesidad de proporcionar servicios continuos</li>
                <li>Obligaciones legales, fiscales o contables</li>
                <li>Resolución de disputas y cumplimiento de nuestros acuerdos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cuando ya no necesitemos procesar su información personal para los propósitos establecidos en esta política, eliminaremos o anonimizaremos su información de manera segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Sus Derechos de Privacidad</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dependiendo de su ubicación geográfica, puede tener ciertos derechos con respecto a su información personal:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Derechos bajo GDPR (Usuarios de la UE)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li><strong>Derecho de Acceso:</strong> Puede solicitar una copia de la información personal que tenemos sobre usted.</li>
                <li><strong>Derecho de Rectificación:</strong> Puede solicitar que corrijamos información inexacta o incompleta.</li>
                <li><strong>Derecho de Supresión:</strong> Puede solicitar que eliminemos su información personal en ciertas circunstancias.</li>
                <li><strong>Derecho a la Portabilidad:</strong> Puede solicitar que transfiramos su información a otra organización o directamente a usted.</li>
                <li><strong>Derecho de Oposición:</strong> Puede oponerse al procesamiento de su información personal en ciertas circunstancias.</li>
                <li><strong>Derecho a Retirar el Consentimiento:</strong> Donde el procesamiento se basa en el consentimiento, puede retirarlo en cualquier momento.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Derechos bajo CCPA (Usuarios de California)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li><strong>Derecho a Saber:</strong> Puede solicitar información sobre las categorías y piezas específicas de información personal que hemos recopilado.</li>
                <li><strong>Derecho a Eliminar:</strong> Puede solicitar que eliminemos su información personal, sujeto a ciertas excepciones.</li>
                <li><strong>Derecho a Optar por No Participar:</strong> Puede optar por no participar en la venta de su información personal (nota: no vendemos información personal).</li>
                <li><strong>Derecho a la No Discriminación:</strong> No lo discriminaremos por ejercer sus derechos de privacidad.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Cómo Ejercer sus Derechos</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para ejercer cualquiera de estos derechos, puede contactarnos a través de los métodos proporcionados en la sección de Contacto. Responderemos a su solicitud dentro de los plazos requeridos por la ley aplicable (generalmente 30 días). Podemos solicitar información adicional para verificar su identidad antes de procesar su solicitud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Privacidad de los Niños</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos conscientemente información personal de niños. Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, contáctenos inmediatamente. Si descubrimos que hemos recopilado información personal de niños sin la verificación del consentimiento parental, tomaremos medidas para eliminar esa información de nuestros servidores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Transferencias Internacionales de Datos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Su información puede ser transferida y mantenida en computadoras ubicadas fuera de su estado, provincia, país u otra jurisdicción gubernamental donde las leyes de protección de datos pueden diferir de las de su jurisdicción. Si se encuentra fuera de nuestro país de operación y elige proporcionarnos información, tenga en cuenta que transferimos los datos a nuestro país y los procesamos allí.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cuando transferimos información personal fuera del Espacio Económico Europeo (EEE), nos aseguramos de que se implementen salvaguardas apropiadas, como cláusulas contractuales estándar aprobadas por la Comisión Europea.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Cambios a esta Política de Privacidad</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos sobre cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización" en la parte superior. Para cambios materiales, proporcionaremos un aviso más prominente, como enviar un correo electrónico o publicar un aviso destacado en nuestro sitio web.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le recomendamos que revise esta Política de Privacidad periódicamente para estar informado sobre cómo protegemos su información. Su uso continuado del servicio después de que publiquemos cambios constituye su aceptación de esos cambios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o nuestras prácticas de datos, puede contactarnos a través de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>WhatsApp:</strong> +57 333 431 5646</li>
                <li><strong>Correo electrónico:</strong> privacidad@giftcards.co</li>
                <li><strong>Dirección postal:</strong> GiftCards Colombia - Departamento de Privacidad</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                Nos comprometemos a resolver cualquier queja sobre nuestra recopilación o uso de su información personal. Si tiene una queja no resuelta relacionada con la privacidad o el uso de datos que no hemos abordado satisfactoriamente, también puede tener derecho a presentar una queja ante su autoridad de protección de datos local.
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
