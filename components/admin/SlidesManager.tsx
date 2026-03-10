'use client'

import { useEffect, useState } from 'react'
import { getAllSlides, createSlide, updateSlide, deleteSlide, type Slide } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

export default function SlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Slide>>({})

  useEffect(() => {
    loadSlides()
  }, [])

  async function loadSlides() {
    try {
      const data = await getAllSlides()
      setSlides(data)
    } catch (error) {
      console.error('Error loading slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCreating(true)
    setFormData({
      titulo: '',
      subtitulo: '',
      imagen_url: '',
      link_opcional: '',
      orden: slides.length + 1,
      activo: true,
    })
  }

  const handleEdit = (slide: Slide) => {
    setEditing(slide.id)
    setFormData(slide)
  }

  const handleSave = async () => {
    try {
      if (creating) {
        await createSlide(formData as Omit<Slide, 'id' | 'created_at' | 'updated_at'>)
      } else if (editing) {
        await updateSlide(editing, formData)
      }
      await loadSlides()
      setCreating(false)
      setEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving slide:', error)
      alert('Error al guardar el slide')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este slide?')) return
    try {
      await deleteSlide(id)
      await loadSlides()
    } catch (error) {
      console.error('Error deleting slide:', error)
      alert('Error al eliminar el slide')
    }
  }

  const handleCancel = () => {
    setCreating(false)
    setEditing(null)
    setFormData({})
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Slides</h2>
        {!creating && !editing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Nuevo Slide
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-primary-200">
          <h3 className="text-xl font-semibold mb-4">
            {creating ? 'Crear Nuevo Slide' : 'Editar Slide'}
          </h3>
          <div className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">Subtítulo</label>
              <input
                type="text"
                value={formData.subtitulo || ''}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL de Imagen *</label>
              <input
                type="url"
                value={formData.imagen_url || ''}
                onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link Opcional</label>
              <input
                type="text"
                value={formData.link_opcional || ''}
                onChange={(e) => setFormData({ ...formData, link_opcional: e.target.value })}
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
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold">{slide.titulo}</h3>
              <p className="text-sm text-gray-600">{slide.subtitulo}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>Orden: {slide.orden}</span>
                <span className={slide.activo ? 'text-green-600' : 'text-red-600'}>
                  {slide.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            {!creating && !editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
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
