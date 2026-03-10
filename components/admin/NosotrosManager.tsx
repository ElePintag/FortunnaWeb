'use client'

import { useEffect, useState } from 'react'
import { getAllNosotros, createNosotros, updateNosotros, deleteNosotros, type Nosotros } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

export default function NosotrosManager() {
  const [sections, setSections] = useState<Nosotros[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Nosotros>>({})

  useEffect(() => {
    loadSections()
  }, [])

  async function loadSections() {
    try {
      const data = await getAllNosotros()
      setSections(data)
    } catch (error) {
      console.error('Error loading nosotros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCreating(true)
    setFormData({
      tipo: 'vision',
      titulo: '',
      contenido: '',
      imagenes: [],
      orden: sections.length + 1,
      activo: true,
    })
  }

  const handleEdit = (section: Nosotros) => {
    setEditing(section.id)
    setFormData(section)
  }

  const handleSave = async () => {
    try {
      if (creating) {
        await createNosotros(formData as Omit<Nosotros, 'id' | 'created_at' | 'updated_at'>)
      } else if (editing) {
        await updateNosotros(editing, formData)
      }
      await loadSections()
      setCreating(false)
      setEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Error al guardar la sección')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return
    try {
      await deleteNosotros(id)
      await loadSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      alert('Error al eliminar la sección')
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
        <h2 className="text-2xl font-bold">Gestión de Nosotros</h2>
        {!creating && !editing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Nueva Sección
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-primary-200">
          <h3 className="text-xl font-semibold mb-4">
            {creating ? 'Crear Nueva Sección' : 'Editar Sección'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select
                value={formData.tipo || 'vision'}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="vision">Visión</option>
                <option value="mision">Misión</option>
                <option value="valores">Valores</option>
                <option value="resena_historica">Reseña Histórica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido *</label>
              <textarea
                rows={6}
                value={formData.contenido || ''}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
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
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={formData.orden || 0}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.activo || false}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Activo</label>
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
        {sections.map((section) => (
          <div key={section.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold">{section.titulo}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{section.contenido}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="capitalize">{section.tipo.replace('_', ' ')}</span>
                <span>Orden: {section.orden}</span>
                <span className={section.activo ? 'text-green-600' : 'text-red-600'}>
                  {section.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            {!creating && !editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
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
