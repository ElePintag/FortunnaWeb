'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTerrenosFeatured, type Terreno } from '@/lib/supabase'
import { MapPin, Ruler } from 'lucide-react'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Terreno[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    try {
      const data = await getTerrenosFeatured()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Propiedades Destacadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-300" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Propiedades Destacadas</h2>
          <p className="text-center text-gray-600">No hay propiedades destacadas disponibles en este momento.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Propiedades Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/propiedades/${property.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group"
            >
              <div className="relative h-64">
                <Image
                  src={property.imagenes[0] || 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'}
                  alt={property.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.estado === 'disponible' ? 'Disponible' : 'Vendido'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{property.nombre}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{property.ubicacion}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Ruler size={16} className="mr-1" />
                  <span className="text-sm">{property.superficie_m2.toLocaleString()} m²</span>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  ${property.precio.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/propiedades"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Ver Todas las Propiedades
          </Link>
        </div>
      </div>
    </section>
  )
}
