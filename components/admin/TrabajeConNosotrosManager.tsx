'use client'

import { useEffect, useState } from 'react'
import { getAllTrabajeConNosotros, updateTrabajeConNosotros, deleteTrabajeConNosotros, type TrabajeConNosotros } from '@/lib/supabase'
import { Trash2, Eye } from 'lucide-react'

export default function TrabajeConNosotrosManager() {
  const [applications, setApplications] = useState<TrabajeConNosotros[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<TrabajeConNosotros | null>(null)

  useEffect(() => {
    loadApplications()
  }, [])

  async function loadApplications() {
    try {
      const data = await getAllTrabajeConNosotros()
      setApplications(data)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, estado: 'nuevo' | 'revisado' | 'contactado') => {
    try {
      await updateTrabajeConNosotros(id, { estado })
      await loadApplications()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al actualizar el estado')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return
    try {
      await deleteTrabajeConNosotros(id)
      await loadApplications()
      if (selectedApp?.id === id) {
        setSelectedApp(null)
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Error al eliminar la solicitud')
    }
  }

  const getStatusBadge = (estado: string) => {
    const colors = {
      nuevo: 'bg-blue-100 text-blue-800',
      revisado: 'bg-yellow-100 text-yellow-800',
      contactado: 'bg-green-100 text-green-800',
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Solicitudes - Trabaje con Nosotros</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-gray-600">No hay solicitudes disponibles.</p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className={`bg-white border rounded-lg p-4 cursor-pointer transition ${
                  selectedApp?.id === app.id ? 'ring-2 ring-primary-600' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{app.nombre_completo}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(app.estado)}`}>
                    {app.estado}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{app.email}</p>
                <p className="text-sm text-gray-600">{app.telefono}</p>
                <p className="text-sm text-gray-500 mt-2">Área: {app.area_interes}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(app.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedApp ? (
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Detalles de la Solicitud</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="mt-1">{selectedApp.nombre_completo}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1">{selectedApp.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="mt-1">{selectedApp.telefono}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Área de Interés</label>
                  <p className="mt-1 capitalize">{selectedApp.area_interes}</p>
                </div>

                {selectedApp.mensaje && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                    <p className="mt-1 whitespace-pre-line">{selectedApp.mensaje}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={selectedApp.estado}
                    onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="revisado">Revisado</option>
                    <option value="contactado">Contactado</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Trash2 size={20} />
                  Eliminar Solicitud
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              <Eye size={48} className="mx-auto mb-4 opacity-50" />
              <p>Selecciona una solicitud para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
