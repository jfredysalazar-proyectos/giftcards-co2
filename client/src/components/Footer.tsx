import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Footer() {
  return (
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
              <li><Link href="/blog"><a className="hover:text-white transition cursor-pointer">Blog</a></Link></li>
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
              <li><Link href="/my-orders"><a className="hover:text-white transition cursor-pointer">Mis Pedidos</a></Link></li>
              <li><a href={getLoginUrl()} className="hover:text-white transition">Iniciar Sesión</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2026 GiftCards Colombia. Todos los derechos reservados. | Impulsado por entrega digital instantánea</p>
        </div>
      </div>
    </footer>
  );
}
