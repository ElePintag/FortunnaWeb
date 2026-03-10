import HeroSlider from '@/components/HeroSlider';
import PropertyCard from '@/components/PropertyCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getSlides, getTerrenosFeatured } from '@/lib/supabase';
import Link from 'next/link';
import { Award, Shield, TrendingUp } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const slides = await getSlides();
  const featuredTerrenos = await getTerrenosFeatured();

  return (
    <div>
      <HeroSlider slides={slides} />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-fortunna-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Experiencia Comprobada</h3>
              <p className="text-gray-600">
                Años de experiencia en el mercado inmobiliario
              </p>
            </div>

            <div className="text-center">
              <div className="bg-fortunna-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguridad Garantizada</h3>
              <p className="text-gray-600">
                Transacciones seguras y respaldadas legalmente
              </p>
            </div>

            <div className="text-center">
              <div className="bg-fortunna-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Alta Plusvalía</h3>
              <p className="text-gray-600">
                Terrenos en zonas con crecimiento garantizado
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Terrenos <span className="text-fortunna-red">Destacados</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Descubre nuestras mejores oportunidades de inversión
            </p>
          </div>

          {featuredTerrenos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredTerrenos.map((terreno) => (
                <PropertyCard key={terreno.id} terreno={terreno} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-12">
              No hay terrenos destacados disponibles en este momento
            </p>
          )}

          <div className="text-center">
            <Link
              href="/catalogo"
              className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-8 pb-16 bg-fortunna-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para invertir en tu futuro?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Contacta con nuestros asesores especializados
          </p>
          <WhatsAppButton
            message="Hola, estoy interesado en conocer más sobre los terrenos disponibles en Fortunna Inmobiliaria"
            className="hover:bg-gray-100"
          />
        </div>
      </section>
    </div>
  );
}
