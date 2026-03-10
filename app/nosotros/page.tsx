'use client';

import { useEffect, useState } from 'react';
import { getNosotros, Nosotros } from '@/lib/supabase';
import Image from 'next/image';

export default function NosotrosPage() {
  const [sections, setSections] = useState<Nosotros[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNosotros();
  }, []);

  const loadNosotros = async () => {
    try {
      const data = await getNosotros();
      setSections(data);
    } catch (error) {
      console.error('Error loading nosotros:', error);
    } finally {
      setLoading(false);
    }
  };

  const tipoLabels = {
    vision: 'Nuestra Visión',
    mision: 'Nuestra Misión',
    valores: 'Nuestros Valores',
    resena_historica: 'Nuestra Historia',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fortunna-red"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conoce más sobre quiénes somos, nuestra misión y los valores que nos guían
          </p>
        </div>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="inline-block bg-fortunna-gold text-white px-4 py-2 rounded-lg mb-4 font-semibold">
                    {tipoLabels[section.tipo]}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {section.titulo}
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {section.contenido}
                  </p>
                </div>
              </div>

              {section.imagenes.length > 0 && (
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-4">
                    {section.imagenes.slice(0, 2).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
                      >
                        <Image
                          src={img}
                          alt={`${section.titulo} ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              El contenido de esta página estará disponible próximamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
