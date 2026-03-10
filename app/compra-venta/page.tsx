'use client'

import { useState } from 'react'
import { createCompraVentaPropiedad } from '@/lib/supabase'
import { Building2, CheckCircle } from 'lucide-react'

export default function CompraVentaPage() {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    tipo_interes: 'compra' as 'compra' | 'venta',
    mensaje: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await createCompraVentaPropiedad(formData)
      setSuccess(true)
      setFormData({
        nombre_completo: '',
        email: '',
        telefono: '',
        tipo_interes: 'compra',
        mensaje: '',
      })
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('Hubo un error al enviar el formulario. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <Building2 size={48} />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">Compra o Venta de Propiedades</h1>
          <p className="text-xl text-center opacity-90">
            Estamos aquí para ayudarte en cada paso del proceso
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Mensaje enviado con éxito!</h2>
              <p className="text-gray-600 mb-6">
                Gracias por tu interés. Nos pondremos en contacto contigo lo antes posible.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Cuéntanos sobre tu interés</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estoy interesado en *
                  </label>
                  <select
                    required
                    value={formData.tipo_interes}
                    onChange={(e) => setFormData({ ...formData, tipo_interes: e.target.value as 'compra' | 'venta' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="compra">Comprar una propiedad</option>
                    <option value="venta">Vender una propiedad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Cuéntanos más sobre lo que buscas..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
