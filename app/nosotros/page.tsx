'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getNosotros, type Nosotros } from '@/lib/supabase'

export default function NosotrosPage() {
  const [sections, setSections] = useState<Nosotros[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSections()
  }, [])

  async function loadSections() {
    try {
      const data = await getNosotros()
      setSections(data)
    } catch (error) {
      console.error('Error loading nosotros:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      vision: 'Nuestra Visión',
      mision: 'Nuestra Misión',
      valores: 'Nuestros Valores',
      resena_historica: 'Reseña Histórica',
    }
    return labels[tipo] || tipo
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nosotros</h1>
          <p className="text-xl opacity-90">Conoce más sobre Fortunna</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No hay información disponible en este momento.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={section.id} className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8 items-center`}>
                {section.imagenes.length > 0 && (
                  <div className="w-full md:w-1/2">
                    <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                      <Image
                        src={section.imagenes[0]}
                        alt={section.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className={`w-full ${section.imagenes.length > 0 ? 'md:w-1/2' : ''}`}>
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-sm text-primary-600 font-semibold mb-2">
                      {getTipoLabel(section.tipo)}
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{section.titulo}</h2>
                    <div className="text-gray-700 whitespace-pre-line">
                      {section.contenido}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
