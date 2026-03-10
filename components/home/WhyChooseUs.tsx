import { Award, Users, TrendingUp, Shield } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Experiencia',
    description: 'Años de experiencia en el mercado inmobiliario',
  },
  {
    icon: Users,
    title: 'Equipo Profesional',
    description: 'Agentes capacitados y comprometidos con tu satisfacción',
  },
  {
    icon: TrendingUp,
    title: 'Mejores Precios',
    description: 'Propiedades con excelente relación calidad-precio',
  },
  {
    icon: Shield,
    title: 'Confianza',
    description: 'Transacciones seguras y transparentes',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
