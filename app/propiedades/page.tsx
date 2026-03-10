'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTerrenos, type Terreno } from '@/lib/supabase'
import { MapPin, Ruler, Search } from 'lucide-react'

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Terreno[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [estado, setEstado] = useState<string>('')

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    try {
      const data = await getTerrenos()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !estado || property.estado === estado
    return matchesSearch && matchesEstado
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nuestras Propiedades</h1>
          <p className="text-xl opacity-90">Encuentra la propiedad perfecta para ti</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No se encontraron propiedades con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
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
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    property.estado === 'disponible'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
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
        )}
      </div>
    </div>
  )
}
