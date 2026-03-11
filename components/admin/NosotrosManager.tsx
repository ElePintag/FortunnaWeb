'use client';

import { useEffect, useState } from 'react';
import { getAllNosotros, createNosotros, updateNosotros, deleteNosotros, Nosotros } from '@/lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react';
import MultipleImageUploader from './MultipleImageUploader';

export default function NosotrosManager() {
  const [nosotros, setNosotros] = useState<Nosotros[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'vision' as 'vision' | 'mision' | 'valores' | 'resena_historica',
    titulo: '',
    contenido: '',
    imagenes: [] as string[],
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    loadNosotros();
  }, []);

  const loadNosotros = async () => {
    try {
      const data = await getAllNosotros();
      setNosotros(data);
    } catch (error) {
      console.error('Error loading nosotros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createNosotros(formData);
      await loadNosotros();
      setIsCreating(false);
      resetForm();
      alert('Sección creada exitosamente');
    } catch (error: any) {
      console.error('Error creating nosotros:', error);
      alert(error?.message || 'Error al crear la sección. Verifica que estés autenticado y que todos los campos estén completos.');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateNosotros(id, formData);
      await loadNosotros();
      setEditingId(null);
      resetForm();
      alert('Sección actualizada exitosamente');
    } catch (error: any) {
      console.error('Error updating nosotros:', error);
      alert(error?.message || 'Error al actualizar la sección. Verifica que estés autenticado y que todos los campos estén completos.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta sección?')) {
      try {
        await deleteNosotros(id);
        await loadNosotros();
      } catch (error) {
        console.error('Error deleting nosotros:', error);
        alert('Error al eliminar la sección');
      }
    }
  };

  const startEdit = (item: Nosotros) => {
    setEditingId(item.id);
    setFormData({
      tipo: item.tipo,
      titulo: item.titulo,
      contenido: item.contenido,
      imagenes: item.imagenes,
      orden: item.orden,
      activo: item.activo,
    });
  };

  const resetForm = () => {
    setFormData({
      tipo: 'vision',
      titulo: '',
      contenido: '',
      imagenes: [],
      orden: 0,
      activo: true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const tipoLabels = {
    vision: 'Visión',
    mision: 'Misión',
    valores: 'Valores',
    resena_historica: 'Reseña Histórica',
  };

  if (loading) {
    return <div className="text-center py-12">Cargando contenido...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Contenido - Nosotros</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-fortunna-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Sección</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? 'Crear Nueva Sección' : 'Editar Sección'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              >
                <option value="vision">Visión</option>
                <option value="mision">Misión</option>
                <option value="valores">Valores</option>
                <option value="resena_historica">Reseña Histórica</option>
              </select>
            </div>

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
              <label className="block text-sm font-semibold mb-2">Contenido *</label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
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

            <div>
              <MultipleImageUploader
                images={formData.imagenes}
                onImagesChange={(imagenes) => setFormData({ ...formData, imagenes })}
                label="Imágenes de la Sección"
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
              onClick={isCreating ? handleCreate : () => handleUpdate(editingId!)}
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
        {nosotros.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-fortunna-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tipoLabels[item.tipo]}
                  </span>
                  {!item.activo && (
                    <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Inactivo
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.titulo}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line line-clamp-3">
                  {item.contenido}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Orden: {item.orden}
                </div>
                {item.imagenes.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {item.imagenes.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${item.titulo} ${idx + 1}`}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    ))}
                    {item.imagenes.length > 3 && (
                      <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                        +{item.imagenes.length - 3} más
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => startEdit(item)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
