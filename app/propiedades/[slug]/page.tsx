'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTerrenoBySlug, type Terreno } from '@/lib/supabase'
import { MapPin, Ruler, ArrowLeft } from 'lucide-react'

export default function PropertyDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [property, setProperty] = useState<Terreno | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (slug) {
      loadProperty()
    }
  }, [slug])

  async function loadProperty() {
    try {
      const data = await getTerrenoBySlug(slug)
      setProperty(data)
    } catch (error) {
      console.error('Error loading property:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/2" />
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-300 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Propiedad no encontrada</h1>
          <Link href="/propiedades" className="text-primary-600 hover:underline">
            Volver a propiedades
          </Link>
        </div>
      </div>
    )
  }

  const images = property.imagenes.length > 0
    ? property.imagenes
    : ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/propiedades"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a propiedades
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={images[currentImage]}
              alt={property.nombre}
              fill
              className="object-cover"
            />
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
              property.estado === 'disponible'
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {property.estado === 'disponible' ? 'Disponible' : 'Vendido'}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                    currentImage === index ? 'ring-4 ring-primary-600' : ''
                  }`}
                >
                  <Image src={img} alt={`${property.nombre} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{property.nombre}</h1>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span>{property.ubicacion}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Ruler size={20} className="mr-2" />
                <span>{property.superficie_m2.toLocaleString()} m²</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-primary-600">
                ${property.precio.toLocaleString()}
              </div>
            </div>

            {property.descripcion && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.descripcion}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-4">¿Interesado en esta propiedad?</h2>
              <p className="text-gray-700 mb-4">
                Contáctanos para más información o para agendar una visita.
              </p>
              <Link
                href="/compra-venta"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
