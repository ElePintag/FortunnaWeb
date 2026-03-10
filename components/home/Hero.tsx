'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSlides, type Slide } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlides()
  }, [])

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [slides.length])

  async function loadSlides() {
    try {
      const data = await getSlides()
      if (data.length > 0) {
        setSlides(data)
      } else {
        setSlides([{
          id: '1',
          titulo: 'Encuentra tu Hogar Perfecto',
          subtitulo: 'Las mejores propiedades en las mejores ubicaciones',
          imagen_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
          link_opcional: '/propiedades',
          orden: 1,
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
      }
    } catch (error) {
      console.error('Error loading slides:', error)
      setSlides([{
        id: '1',
        titulo: 'Encuentra tu Hogar Perfecto',
        subtitulo: 'Las mejores propiedades en las mejores ubicaciones',
        imagen_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
        link_opcional: '/propiedades',
        orden: 1,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.imagen_url}
            alt={slide.titulo}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {slide.titulo}
              </h1>
              {slide.subtitulo && (
                <p className="text-xl md:text-2xl mb-8">
                  {slide.subtitulo}
                </p>
              )}
              {slide.link_opcional && (
                <Link
                  href={slide.link_opcional}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Ver Propiedades
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
