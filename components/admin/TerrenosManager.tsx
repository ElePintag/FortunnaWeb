'use client';

import { useEffect, useState } from 'react';
import { getAllTerrenos, createTerreno, updateTerreno, deleteTerreno, Terreno } from '@/lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react';
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
    revisado: false,
    revisado_por: '',
    comentario_revision: '',
    contactado: false,
    contactado_por: '',
    detalle_contacto: '',
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
      alert('Terreno creado exitosamente');
    } catch (error: any) {
      console.error('Error creating terreno:', error);
      alert(error?.message || 'Error al crear el terreno. Verifica que estés autenticado y que todos los campos requeridos estén completos.');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { imagenesText, ...terrenoData } = formData;
      await updateTerreno(id, terrenoData);
      await loadTerrenos();
      setEditingId(null);
      resetForm();
      alert('Terreno actualizado exitosamente');
    } catch (error: any) {
      console.error('Error updating terreno:', error);
      alert(error?.message || 'Error al actualizar el terreno. Verifica que estés autenticado y que todos los campos requeridos estén completos.');
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
      revisado: terreno.revisado || false,
      revisado_por: terreno.revisado_por || '',
      comentario_revision: terreno.comentario_revision || '',
      contactado: terreno.contactado || false,
      contactado_por: terreno.contactado_por || '',
      detalle_contacto: terreno.detalle_contacto || '',
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
      revisado: false,
      revisado_por: '',
      comentario_revision: '',
      contactado: false,
      contactado_por: '',
      detalle_contacto: '',
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

            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold mb-4">Estado de Revisión</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.revisado}
                      onChange={(e) => setFormData({ ...formData, revisado: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold">Revisado</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Revisado por</label>
                  <input
                    type="text"
                    value={formData.revisado_por}
                    onChange={(e) => setFormData({ ...formData, revisado_por: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Comentario de Revisión</label>
                  <textarea
                    value={formData.comentario_revision}
                    onChange={(e) => setFormData({ ...formData, comentario_revision: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    placeholder="Comentarios sobre la revisión"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold mb-4">Estado de Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.contactado}
                      onChange={(e) => setFormData({ ...formData, contactado: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold">Contactado</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contactado por</label>
                  <input
                    type="text"
                    value={formData.contactado_por}
                    onChange={(e) => setFormData({ ...formData, contactado_por: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Detalle de Contacto</label>
                  <textarea
                    value={formData.detalle_contacto}
                    onChange={(e) => setFormData({ ...formData, detalle_contacto: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
                    placeholder="Detalles del contacto realizado"
                  />
                </div>
              </div>
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

                {(terreno.revisado || terreno.contactado) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    {terreno.revisado && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-blue-900">✓ Revisado</span>
                          {terreno.revisado_por && (
                            <span className="text-sm text-blue-700">por {terreno.revisado_por}</span>
                          )}
                        </div>
                        {terreno.comentario_revision && (
                          <p className="text-sm text-blue-800 mt-1">{terreno.comentario_revision}</p>
                        )}
                      </div>
                    )}
                    {terreno.contactado && (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-green-900">✓ Contactado</span>
                          {terreno.contactado_por && (
                            <span className="text-sm text-green-700">por {terreno.contactado_por}</span>
                          )}
                        </div>
                        {terreno.detalle_contacto && (
                          <p className="text-sm text-green-800 mt-1">{terreno.detalle_contacto}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
