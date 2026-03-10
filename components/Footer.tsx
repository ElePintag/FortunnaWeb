import Link from 'next/link';
import { Building2, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-8 w-8 text-fortunna-gold" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">FORTUNNA</span>
                <span className="text-xs text-fortunna-gold font-semibold">
                  INMOBILIARIA
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu aliado confiable en bienes raíces.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-fortunna-gold">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-fortunna-gold transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-gray-400 hover:text-fortunna-gold transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-fortunna-gold transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-fortunna-red hover:text-fortunna-gold transition-colors font-semibold"
                >
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-fortunna-gold">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-fortunna-gold mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Calle Juan Montalvo, entre Chile y Gaspar de Villaroel
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-fortunna-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">0959 185 490</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-fortunna-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  fortunnainmobiliaria@gmail.com
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-fortunna-gold">
              Síguenos
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/fortunnainmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-fortunna-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@fortunna_inmobiliaria?lang=es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-fortunna-gold transition-colors"
              >
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Fortunna Inmobiliaria. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
