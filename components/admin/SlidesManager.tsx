'use client';

import { useEffect, useState } from 'react';
import { getAllSlides, createSlide, updateSlide, deleteSlide, Slide } from '@/lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function SlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagen_url: '',
    link_opcional: '',
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const data = await getAllSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createSlide(formData);
      await loadSlides();
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Error creating slide:', error);
      alert('Error al crear el slide');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateSlide(id, formData);
      await loadSlides();
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error updating slide:', error);
      alert('Error al actualizar el slide');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este slide?')) {
      try {
        await deleteSlide(id);
        await loadSlides();
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Error al eliminar el slide');
      }
    }
  };

  const startEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setFormData({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo || '',
      imagen_url: slide.imagen_url,
      link_opcional: slide.link_opcional || '',
      orden: slide.orden,
      activo: slide.activo,
    });
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      subtitulo: '',
      imagen_url: '',
      link_opcional: '',
      orden: 0,
      activo: true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-12">Cargando slides...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Slides</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-fortunna-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Slide</span>
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Crear Nuevo Slide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subtítulo</label>
              <input
                type="text"
                value={formData.subtitulo}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploader
                currentImage={formData.imagen_url}
                onImageUploaded={(url) => setFormData({ ...formData, imagen_url: url })}
                label="Imagen del Slide"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Link Opcional</label>
              <input
                type="text"
                value={formData.link_opcional}
                onChange={(e) => setFormData({ ...formData, link_opcional: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Orden</label>
              <input
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold">Activo</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleCreate}
              className="bg-fortunna-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Guardar</span>
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <X className="h-5 w-5" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-md p-6">
            {editingId === slide.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Subtítulo</label>
                    <input
                      type="text"
                      value={formData.subtitulo}
                      onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUploader
                      currentImage={formData.imagen_url}
                      onImageUploaded={(url) => setFormData({ ...formData, imagen_url: url })}
                      label="Imagen del Slide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Link Opcional</label>
                    <input
                      type="text"
                      value={formData.link_opcional}
                      onChange={(e) => setFormData({ ...formData, link_opcional: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Orden</label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold">Activo</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUpdate(slide.id)}
                    className="bg-fortunna-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{slide.titulo}</h3>
                  {slide.subtitulo && (
                    <p className="text-gray-600 mb-2">{slide.subtitulo}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Orden: {slide.orden}</span>
                    <span className={slide.activo ? 'text-green-600' : 'text-red-600'}>
                      {slide.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <img
                      src={slide.imagen_url}
                      alt={slide.titulo}
                      className="w-48 h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(slide)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
