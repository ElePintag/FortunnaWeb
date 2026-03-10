import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ¿Listo para encontrar tu propiedad ideal?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Contáctanos hoy y déjanos ayudarte a hacer realidad tus sueños
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/compra-venta"
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
          >
            Comprar o Vender
          </Link>
          <Link
            href="/trabaje-con-nosotros"
            className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition"
          >
            Trabaje con Nosotros
          </Link>
        </div>
      </div>
    </section>
  )
}
