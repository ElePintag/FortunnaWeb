import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize, DollarSign } from 'lucide-react';
import { Terreno } from '@/lib/supabase';

interface PropertyCardProps {
  terreno: Terreno;
}

export default function PropertyCard({ terreno }: PropertyCardProps) {
  const imageUrl = terreno.imagenes?.[0] || 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg';

  return (
    <Link href={`/terreno/${terreno.slug}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={terreno.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          {terreno.destacado && (
            <div className="absolute top-4 left-4 bg-fortunna-gold text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              Destacado
            </div>
          )}
          {terreno.estado === 'vendido' && (
            <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              Vendido
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-fortunna-red transition-colors">
            {terreno.nombre}
          </h3>

          <div className="flex items-center text-gray-700 mb-4">
            <MapPin className="h-5 w-5 mr-2 text-fortunna-red" />
            <span className="text-sm font-medium">{terreno.ubicacion}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-1">
                <Maximize className="h-5 w-5 text-fortunna-gold" />
                <p className="text-xs text-gray-600 font-semibold">Superficie</p>
              </div>
              <p className="text-base font-bold text-gray-900">
                {terreno.superficie_m2.toLocaleString()} m²
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-5 w-5 text-fortunna-gold" />
                <p className="text-xs text-gray-600 font-semibold">Precio</p>
              </div>
              <p className="text-base font-bold text-fortunna-red">
                ${terreno.precio.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="bg-fortunna-red text-white px-4 py-3 rounded-lg font-bold text-center group-hover:bg-red-700 transition-all shadow-md flex items-center justify-center space-x-2">
              <span>Ver Detalles</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
