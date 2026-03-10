'use client'

import { useEffect, useState } from 'react'
import { getAllTerrenos, createTerreno, updateTerreno, deleteTerreno, type Terreno } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

export default function TerrenosManager() {
  const [terrenos, setTerrenos] = useState<Terreno[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Terreno>>({})

  useEffect(() => {
    loadTerrenos()
  }, [])

  async function loadTerrenos() {
    try {
      const data = await getAllTerrenos()
      setTerrenos(data)
    } catch (error) {
      console.error('Error loading terrenos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCreating(true)
    setFormData({
      nombre: '',
      slug: '',
      ubicacion: '',
      precio: 0,
      superficie_m2: 0,
      estado: 'disponible',
      descripcion: '',
      imagenes: [],
      destacado: false,
      fecha_publicacion: new Date().toISOString(),
    })
  }

  const handleEdit = (terreno: Terreno) => {
    setEditing(terreno.id)
    setFormData(terreno)
  }

  const handleSave = async () => {
    try {
      if (creating) {
        await createTerreno(formData as Omit<Terreno, 'id' | 'created_at' | 'updated_at'>)
      } else if (editing) {
        await updateTerreno(editing, formData)
      }
      await loadTerrenos()
      setCreating(false)
      setEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving terreno:', error)
      alert('Error al guardar la propiedad')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return
    try {
      await deleteTerreno(id)
      await loadTerrenos()
    } catch (error) {
      console.error('Error deleting terreno:', error)
      alert('Error al eliminar la propiedad')
    }
  }

  const handleCancel = () => {
    setCreating(false)
    setEditing(null)
    setFormData({})
  }

  const handleImageUrlsChange = (value: string) => {
    const urls = value.split('\n').filter(url => url.trim())
    setFormData({ ...formData, imagenes: urls })
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Propiedades</h2>
        {!creating && !editing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Nueva Propiedad
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-primary-200">
          <h3 className="text-xl font-semibold mb-4">
            {creating ? 'Crear Nueva Propiedad' : 'Editar Propiedad'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ubicación *</label>
              <input
                type="text"
                value={formData.ubicacion || ''}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio *</label>
                <input
                  type="number"
                  value={formData.precio || 0}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Superficie (m²) *</label>
                <input
                  type="number"
                  value={formData.superficie_m2 || 0}
                  onChange={(e) => setFormData({ ...formData, superficie_m2: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado *</label>
              <select
                value={formData.estado || 'disponible'}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'disponible' | 'vendido' })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                rows={4}
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URLs de Imágenes (una por línea)</label>
              <textarea
                rows={3}
                value={formData.imagenes?.join('\n') || ''}
                onChange={(e) => handleImageUrlsChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.destacado || false}
                onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Destacado</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Save size={20} />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                <X size={20} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {terrenos.map((terreno) => (
          <div key={terreno.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold">{terreno.nombre}</h3>
              <p className="text-sm text-gray-600">{terreno.ubicacion}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>${terreno.precio.toLocaleString()}</span>
                <span>{terreno.superficie_m2} m²</span>
                <span className={terreno.estado === 'disponible' ? 'text-green-600' : 'text-gray-600'}>
                  {terreno.estado}
                </span>
                {terreno.destacado && <span className="text-yellow-600">★ Destacado</span>}
              </div>
            </div>
            {!creating && !editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(terreno)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(terreno.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
