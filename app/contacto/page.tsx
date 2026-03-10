'use client';

import { useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: 'success',
        message:
          '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
      });

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-fortunna-red">Contacto</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Estamos aquí para ayudarte a encontrar tu terreno ideal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-fortunna-red w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                    <p className="text-gray-600">
                      Calle Juan Montalvo, entre Chile y Gaspar de Villaroel
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-fortunna-gold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                    <p className="text-gray-600">0959184490</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-fortunna-red w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">fortunnainmobiliaria@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-fortunna-red text-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                ¿Prefieres WhatsApp?
              </h2>
              <p className="mb-6 text-white/90">
                Contáctanos directamente por WhatsApp para una respuesta más rápida
              </p>
              <WhatsAppButton
                message="Hola, me gustaría obtener más información sobre sus servicios"
                className="bg-white text-fortunna-red hover:bg-gray-100 w-full justify-center"
              />
            </div>

            <WhatsAppButton
              message="Hola, me gustaría obtener más información sobre sus servicios"
              className="fixed bottom-6 right-6 z-50 shadow-2xl bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full flex items-center space-x-2"
            />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Envíanos un Mensaje</h2>

              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold mb-2 text-gray-700"
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2 text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-semibold mb-2 text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  placeholder="+52 123 456 7890"
                />
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-semibold mb-2 text-gray-700"
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-fortunna-red text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Envía tu Hoja de Vida</h2>
              <p className="text-gray-600 mb-6">
                ¿Buscas oportunidades de trabajo? Envía tu hoja de vida al siguiente correo:
              </p>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-6 w-6 text-fortunna-red" />
                <a
                  href="mailto:fortunnainmobiliaria@gmail.com"
                  className="text-lg font-semibold text-fortunna-red hover:underline"
                >
                  fortunnainmobiliaria@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Asegúrate de incluir tu CV actualizado y una carta de presentación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
