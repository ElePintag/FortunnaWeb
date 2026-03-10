'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Fortunna
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <ul className="hidden md:flex space-x-8">
            <li>
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/propiedades" className="text-gray-700 hover:text-primary-600 transition">
                Propiedades
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="text-gray-700 hover:text-primary-600 transition">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/compra-venta" className="text-gray-700 hover:text-primary-600 transition">
                Compra/Venta
              </Link>
            </li>
            <li>
              <Link href="/trabaje-con-nosotros" className="text-gray-700 hover:text-primary-600 transition">
                Trabaje con Nosotros
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-semibold transition">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-2 pb-4">
            <li>
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/propiedades"
                className="block py-2 text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros"
                className="block py-2 text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/compra-venta"
                className="block py-2 text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Compra/Venta
              </Link>
            </li>
            <li>
              <Link
                href="/trabaje-con-nosotros"
                className="block py-2 text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Trabaje con Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="block py-2 text-primary-600 hover:text-primary-700 font-semibold transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  )
}
