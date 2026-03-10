'use client';

import { useEffect, useState } from 'react';
import { getAllCompraVentaPropiedades, updateCompraVentaPropiedad, deleteCompraVentaPropiedad, CompraVentaPropiedad } from '@/lib/supabase';
import { Trash2, Eye, Mail, Phone, Home } from 'lucide-react';

export default function CompraVentaManager() {
  const [solicitudes, setSolicitudes] = useState<CompraVentaPropiedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      const data = await getAllCompraVentaPropiedades();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error loading solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, estado: 'nuevo' | 'revisado' | 'contactado') => {
    try {
      await updateCompraVentaPropiedad(id, { estado });
      await loadSolicitudes();
    } catch (error) {
      console.error('Error updating solicitud:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
      try {
        await deleteCompraVentaPropiedad(id);
        await loadSolicitudes();
      } catch (error) {
        console.error('Error deleting solicitud:', error);
        alert('Error al eliminar la solicitud');
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      nuevo: 'bg-blue-100 text-blue-800',
      revisado: 'bg-yellow-100 text-yellow-800',
      contactado: 'bg-green-100 text-green-800',
    };
    return styles[estado as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getTipoInteresLabel = (tipo: string) => {
    return tipo === 'compra' ? 'Comprar' : 'Vender';
  };

  if (loading) {
    return <div className="text-center py-12">Cargando solicitudes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Compra/Venta de Propiedades</h2>
        <div className="text-sm text-gray-600">
          Total: {solicitudes.length} solicitudes
        </div>
      </div>

      <div className="space-y-4">
        {solicitudes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No hay solicitudes aún</p>
          </div>
        ) : (
          solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold">{solicitud.nombre_completo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(solicitud.estado)}`}>
                      {solicitud.estado.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-fortunna-red text-white">
                      {getTipoInteresLabel(solicitud.tipo_interes)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Recibido: {new Date(solicitud.created_at).toLocaleString('es-ES')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Mail className="h-4 w-4 text-fortunna-red" />
                      <span className="text-sm">{solicitud.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="h-4 w-4 text-fortunna-red" />
                      <span className="text-sm">{solicitud.telefono}</span>
                    </div>
                  </div>

                  {solicitud.mensaje && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Mensaje:</p>
                      <p className="text-sm text-gray-600">{solicitud.mensaje}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(solicitud.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors ml-4"
                  title="Eliminar solicitud"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleStatusUpdate(solicitud.id, 'nuevo')}
                  disabled={solicitud.estado === 'nuevo'}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    solicitud.estado === 'nuevo'
                      ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                  }`}
                >
                  Nuevo
                </button>
                <button
                  onClick={() => handleStatusUpdate(solicitud.id, 'revisado')}
                  disabled={solicitud.estado === 'revisado'}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    solicitud.estado === 'revisado'
                      ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                  }`}
                >
                  Revisado
                </button>
                <button
                  onClick={() => handleStatusUpdate(solicitud.id, 'contactado')}
                  disabled={solicitud.estado === 'contactado'}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    solicitud.estado === 'contactado'
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-800'
                  }`}
                >
                  Contactado
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
