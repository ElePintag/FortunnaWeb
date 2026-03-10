'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, Menu, X, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getConfiguracionByClave } from '@/lib/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await getConfiguracionByClave('logo_url');
        if (config && config.valor) {
          setLogoUrl(config.valor);
        }
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center space-x-3">
            {logoUrl ? (
              <div className="relative h-16 w-48">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                  sizes="200px"
                />
              </div>
            ) : (
              <>
                <Building2 className="h-12 w-12 text-fortunna-red" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-fortunna-red tracking-tight">
                    FORTUNNA
                  </span>
                  <span className="text-sm text-fortunna-gold font-semibold tracking-wider">
                    INMOBILIARIA
                  </span>
                </div>
              </>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-fortunna-red transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="text-gray-700 hover:text-fortunna-red transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1"
            >
              Casas y Terrenos
            </Link>
            <Link
              href="/nosotros"
              className="text-gray-700 hover:text-fortunna-red transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1"
            >
              Nosotros
            </Link>
            <Link
              href="/trabaje-con-nosotros"
              className="text-gray-700 hover:text-fortunna-red transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1"
            >
              Compra o Vende
            </Link>
            <Link
              href="/contacto"
              className="text-gray-700 hover:text-fortunna-red transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1"
            >
              Contacto
            </Link>
            <Link
              href="/admin"
              className="bg-white text-fortunna-red px-6 py-2 rounded-lg hover:bg-fortunna-red hover:text-white transition-colors font-medium flex items-center space-x-2 border-2 border-fortunna-red"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t">
            <Link
              href="/"
              className="block text-gray-700 hover:text-fortunna-red transition-colors font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block text-gray-700 hover:text-fortunna-red transition-colors font-medium text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Casas y Terrenos
            </Link>
            <Link
              href="/nosotros"
              className="block text-gray-700 hover:text-fortunna-red transition-colors font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/trabaje-con-nosotros"
              className="block text-gray-700 hover:text-fortunna-red transition-colors font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Compra o Vende
            </Link>
            <Link
              href="/contacto"
              className="block text-gray-700 hover:text-fortunna-red transition-colors font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-center space-x-2 bg-white text-fortunna-red px-6 py-2 rounded-lg hover:bg-fortunna-red hover:text-white transition-colors font-medium border-2 border-fortunna-red"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
