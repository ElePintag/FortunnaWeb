'use client';

import { useEffect, useState } from 'react';
import { getAllTrabajeConNosotros, updateTrabajeConNosotros, deleteTrabajeConNosotros, TrabajeConNosotros } from '@/lib/supabase';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';

export default function TrabajeConNosotrosManager() {
  const [aplicaciones, setAplicaciones] = useState<TrabajeConNosotros[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAplicaciones();
  }, []);

  const loadAplicaciones = async () => {
    try {
      const data = await getAllTrabajeConNosotros();
      setAplicaciones(data);
    } catch (error) {
      console.error('Error loading aplicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (id: string, estado: 'nuevo' | 'revisado' | 'contactado') => {
    try {
      await updateTrabajeConNosotros(id, { estado });
      await loadAplicaciones();
    } catch (error) {
      console.error('Error updating estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta aplicación?')) {
      try {
        await deleteTrabajeConNosotros(id);
        await loadAplicaciones();
      } catch (error) {
        console.error('Error deleting aplicacion:', error);
        alert('Error al eliminar la aplicación');
      }
    }
  };

  const estadoColors = {
    nuevo: 'bg-blue-500',
    revisado: 'bg-yellow-500',
    contactado: 'bg-green-500',
  };

  const estadoLabels = {
    nuevo: 'Nuevo',
    revisado: 'Revisado',
    contactado: 'Contactado',
  };

  if (loading) {
    return <div className="text-center py-12">Cargando aplicaciones...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Aplicaciones de Trabajo</h2>
        <p className="text-gray-600 mt-2">
          Total de aplicaciones: {aplicaciones.length}
        </p>
      </div>

      <div className="space-y-4">
        {aplicaciones.map((aplicacion) => (
          <div key={aplicacion.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold">{aplicacion.nombre_completo}</h3>
                  <span className={`${estadoColors[aplicacion.estado]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {estadoLabels[aplicacion.estado]}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Mail className="h-4 w-4 text-fortunna-red" />
                    <span className="text-sm">{aplicacion.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="h-4 w-4 text-fortunna-red" />
                    <span className="text-sm">{aplicacion.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-fortunna-red" />
                    <span className="text-sm">
                      {new Date(aplicacion.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Área de Interés:</p>
                  <p className="text-gray-900">{aplicacion.area_interes}</p>
                </div>

                {aplicacion.mensaje && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Mensaje:</p>
                    <p className="text-gray-900 whitespace-pre-line">{aplicacion.mensaje}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateEstado(aplicacion.id, 'nuevo')}
                    className={`px-3 py-1 rounded text-sm ${
                      aplicacion.estado === 'nuevo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Nuevo
                  </button>
                  <button
                    onClick={() => handleUpdateEstado(aplicacion.id, 'revisado')}
                    className={`px-3 py-1 rounded text-sm ${
                      aplicacion.estado === 'revisado' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Revisado
                  </button>
                  <button
                    onClick={() => handleUpdateEstado(aplicacion.id, 'contactado')}
                    className={`px-3 py-1 rounded text-sm ${
                      aplicacion.estado === 'contactado' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Contactado
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDelete(aplicacion.id)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors ml-4"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {aplicaciones.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No hay aplicaciones de trabajo aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
