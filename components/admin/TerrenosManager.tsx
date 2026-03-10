'use client';

import { useEffect, useState } from 'react';
import { getAllTerrenos, createTerreno, updateTerreno, deleteTerreno, Terreno } from '@/lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import MultipleImageUploader from './MultipleImageUploader';

export default function TerrenosManager() {
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    ubicacion: '',
    precio: 0,
    superficie_m2: 0,
    estado: 'disponible' as 'disponible' | 'vendido',
    descripcion: '',
    imagenes: [] as string[],
    imagenesText: '',
    destacado: false,
    fecha_publicacion: new Date().toISOString(),
  });

  useEffect(() => {
    loadTerrenos();
  }, []);

  const loadTerrenos = async () => {
    try {
      const data = await getAllTerrenos();
      setTerrenos(data);
    } catch (error) {
      console.error('Error loading terrenos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreate = async () => {
    try {
      const { imagenesText, ...terrenoData } = formData;
      await createTerreno(terrenoData);
      await loadTerrenos();
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Error creating terreno:', error);
      alert('Error al crear el terreno');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { imagenesText, ...terrenoData } = formData;
      await updateTerreno(id, terrenoData);
      await loadTerrenos();
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error updating terreno:', error);
      alert('Error al actualizar el terreno');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este terreno?')) {
      try {
        await deleteTerreno(id);
        await loadTerrenos();
      } catch (error) {
        console.error('Error deleting terreno:', error);
        alert('Error al eliminar el terreno');
      }
    }
  };

  const startEdit = (terreno: Terreno) => {
    setEditingId(terreno.id);
    setFormData({
      nombre: terreno.nombre,
      slug: terreno.slug,
      ubicacion: terreno.ubicacion,
      precio: terreno.precio,
      superficie_m2: terreno.superficie_m2,
      estado: terreno.estado,
      descripcion: terreno.descripcion || '',
      imagenes: terreno.imagenes,
      imagenesText: '',
      destacado: terreno.destacado,
      fecha_publicacion: terreno.fecha_publicacion,
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      slug: '',
      ubicacion: '',
      precio: 0,
      superficie_m2: 0,
      estado: 'disponible',
      descripcion: '',
      imagenes: [],
      imagenesText: '',
      destacado: false,
      fecha_publicacion: new Date().toISOString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-12">Cargando terrenos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Terrenos</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-fortunna-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Terreno</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? 'Crear Nuevo Terreno' : 'Editar Terreno'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nombre: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Slug (generado automáticamente)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Ubicación *</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Precio *</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Superficie (m²) *</label>
              <input
                type="number"
                value={formData.superficie_m2}
                onChange={(e) => setFormData({ ...formData, superficie_m2: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'disponible' | 'vendido' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                required
              >
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
              />
            </div>

            <div className="md:col-span-2">
              <MultipleImageUploader
                images={formData.imagenes}
                onImagesChange={(imagenes) => setFormData({ ...formData, imagenes })}
                label="Imágenes del Terreno"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.destacado}
                  onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold">Destacado</span>
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
        {terrenos.map((terreno) => (
          <div key={terreno.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{terreno.nombre}</h3>
                <p className="text-gray-600 mb-2">{terreno.ubicacion}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Precio:</span>
                    <p className="font-semibold">${terreno.precio.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Superficie:</span>
                    <p className="font-semibold">{terreno.superficie_m2} m²</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <p className={`font-semibold ${terreno.estado === 'disponible' ? 'text-green-600' : 'text-red-600'}`}>
                      {terreno.estado === 'disponible' ? 'Disponible' : 'Vendido'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Destacado:</span>
                    <p className="font-semibold">{terreno.destacado ? 'Sí' : 'No'}</p>
                  </div>
                </div>
                {terreno.imagenes.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {terreno.imagenes.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${terreno.nombre} ${idx + 1}`}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    ))}
                    {terreno.imagenes.length > 3 && (
                      <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                        +{terreno.imagenes.length - 3} más
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => startEdit(terreno)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(terreno.id)}
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
