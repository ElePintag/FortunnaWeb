'use client';

import { useState } from 'react';
import { createCompraVentaPropiedad } from '@/lib/supabase';
import { Mail, Phone, Home, Send } from 'lucide-react';

export default function CompraVendePropiedadPage() {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    tipo_interes: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCompraVentaPropiedad({
        nombre_completo: formData.nombre_completo,
        email: formData.email,
        telefono: formData.telefono,
        tipo_interes: formData.tipo_interes as 'compra' | 'venta',
        mensaje: formData.mensaje || null,
      });
      setSubmitted(true);
      setFormData({
        nombre_completo: '',
        email: '',
        telefono: '',
        tipo_interes: '',
        mensaje: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al enviar el formulario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ¿Quieres <span className="text-fortunna-red">Comprar</span> o <span className="text-fortunna-red">Vender</span> tu Propiedad?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completa el formulario y nuestro equipo de expertos se pondrá en contacto contigo
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Solicitud Enviada!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Gracias por contactarnos. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo pronto.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-fortunna-red text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-fortunna-red" />
                        <span>Email *</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-fortunna-red" />
                        <span>Teléfono *</span>
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                      placeholder="+593 999 999 999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-fortunna-red" />
                      <span>¿Qué te interesa? *</span>
                    </div>
                  </label>
                  <select
                    name="tipo_interes"
                    value={formData.tipo_interes}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="compra">Comprar una propiedad</option>
                    <option value="venta">Vender mi propiedad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje (Opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                    placeholder="Cuéntanos más detalles sobre tu interés, ubicación, presupuesto, características de la propiedad, etc..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-fortunna-red text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Enviar Solicitud</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Al enviar este formulario, aceptas que tus datos sean utilizados para
                  contactarte y brindarte información sobre propiedades.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
