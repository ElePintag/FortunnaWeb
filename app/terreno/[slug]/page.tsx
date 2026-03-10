'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getTerrenoBySlug, Terreno } from '@/lib/supabase';
import WhatsAppButton from '@/components/WhatsAppButton';
import { MapPin, Maximize, DollarSign, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TerrenoDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [terreno, setTerreno] = useState<Terreno | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadTerreno();
    }
  }, [slug]);

  const loadTerreno = async () => {
    setLoading(true);
    try {
      const data = await getTerrenoBySlug(slug);
      setTerreno(data);
    } catch (error) {
      console.error('Error loading terreno:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (terreno && terreno.imagenes.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % terreno.imagenes.length);
    }
  };

  const prevImage = () => {
    if (terreno && terreno.imagenes.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + terreno.imagenes.length) % terreno.imagenes.length
      );
    }
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

  if (!terreno) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Terreno no encontrado</h1>
          <p className="text-gray-600 mb-8">
            El terreno que buscas no existe o ha sido eliminado
          </p>
          <Link
            href="/catalogo"
            className="bg-fortunna-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hola, estoy interesado en el terreno "${terreno.nombre}" ubicado en ${terreno.ubicacion}. ¿Podrían darme más información?`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-fortunna-red hover:underline mb-6 font-semibold"
        >
          ← Volver al Catálogo
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-96 lg:h-full">
              {terreno.imagenes.length > 0 ? (
                <>
                  <Image
                    src={terreno.imagenes[currentImageIndex]}
                    alt={`${terreno.nombre} - Imagen ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {terreno.imagenes.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {terreno.imagenes.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? 'bg-fortunna-gold w-6'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {terreno.estado === 'vendido' && (
                    <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Vendido
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Sin imágenes disponibles</p>
                </div>
              )}
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">{terreno.nombre}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2 text-fortunna-gold" />
                <span className="text-lg">{terreno.ubicacion}</span>
              </div>

              <div className="text-5xl font-bold text-fortunna-red mb-8">
                ${terreno.precio.toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Maximize className="h-6 w-6 text-fortunna-gold" />
                    <span className="text-sm text-gray-600">Superficie</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {terreno.superficie_m2.toLocaleString()} m²
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="h-6 w-6 text-fortunna-gold" />
                    <span className="text-sm text-gray-600">Publicado</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {new Date(terreno.fecha_publicacion).toLocaleDateString(
                      'es-MX'
                    )}
                  </p>
                </div>
              </div>

              {terreno.descripcion && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {terreno.descripcion}
                  </p>
                </div>
              )}

              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">¿Interesado?</h2>
                <p className="text-gray-600 mb-6">
                  Contáctanos para agendar una visita o solicitar más información
                </p>
                <WhatsAppButton message={whatsappMessage} className="w-full justify-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
