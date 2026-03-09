'use client';

import { useEffect, useState } from 'react';
import { getAllCompraVentaPropiedades, updateCompraVentaPropiedad, deleteCompraVentaPropiedad, CompraVentaPropiedad, getUserEmail } from '@/lib/supabase';
import { Trash2, Eye, Mail, Phone, Chrome as Home, User, Calendar, FileText, CreditCard as Edit, History } from 'lucide-react';
import ActivityLogViewer from './ActivityLogViewer';

export default function CompraVentaManager() {
  const [solicitudes, setSolicitudes] = useState<CompraVentaPropiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEstado, setEditingEstado] = useState<'nuevo' | 'revisado' | 'contactado'>('nuevo');
  const [accionTomada, setAccionTomada] = useState('');
  const [notasRevision, setNotasRevision] = useState('');
  const [notasContacto, setNotasContacto] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      const data = await getAllCompraVentaPropiedades();
      setSolicitudes(data);

      // Cargar emails de usuarios
      const userIds = new Set<string>();
      data.forEach((solicitud) => {
        if (solicitud.ingresado_por) userIds.add(solicitud.ingresado_por);
        if (solicitud.revisado_por) userIds.add(solicitud.revisado_por);
        if (solicitud.contactado_por) userIds.add(solicitud.contactado_por);
      });

      const emails: { [key: string]: string } = {};
      for (const userId of Array.from(userIds)) {
        const email = await getUserEmail(userId);
        if (email) emails[userId] = email;
      }
      setUserEmails(emails);
    } catch (error) {
      console.error('Error loading solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (solicitud: CompraVentaPropiedad, nuevoEstado: 'nuevo' | 'revisado' | 'contactado') => {
    setEditingId(solicitud.id);
    setEditingEstado(nuevoEstado);
    setAccionTomada(solicitud.accion_tomada || '');
    setNotasRevision(solicitud.notas_revision || '');
    setNotasContacto(solicitud.notas_contacto || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setAccionTomada('');
    setNotasRevision('');
    setNotasContacto('');
  };

  const handleStatusUpdate = async (id: string, estado: 'nuevo' | 'revisado' | 'contactado') => {
    try {
      const updateData: any = { estado };

      if (estado === 'revisado') {
        if (accionTomada) updateData.accion_tomada = accionTomada;
        if (notasRevision) updateData.notas_revision = notasRevision;
      } else if (estado === 'contactado') {
        if (notasContacto) updateData.notas_contacto = notasContacto;
      }

      await updateCompraVentaPropiedad(id, updateData);
      await loadSolicitudes();
      cancelEditing();
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

  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'nuevo' | 'revisado' | 'contactado'>('todos');

  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtroEstado === 'todos') return true;
    return s.estado === filtroEstado;
  });

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

      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            filtroEstado === 'todos'
              ? 'bg-fortunna-red text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos ({solicitudes.length})
        </button>
        <button
          onClick={() => setFiltroEstado('nuevo')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            filtroEstado === 'nuevo'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Nuevos ({solicitudes.filter(s => s.estado === 'nuevo').length})
        </button>
        <button
          onClick={() => setFiltroEstado('revisado')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            filtroEstado === 'revisado'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Revisados ({solicitudes.filter(s => s.estado === 'revisado').length})
        </button>
        <button
          onClick={() => setFiltroEstado('contactado')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            filtroEstado === 'contactado'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Contactados ({solicitudes.filter(s => s.estado === 'contactado').length})
        </button>
      </div>

      <div className="space-y-4">
        {solicitudesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">
              {solicitudes.length === 0 ? 'No hay solicitudes aún' : `No hay solicitudes en estado "${filtroEstado}"`}
            </p>
          </div>
        ) : (
          solicitudesFiltradas.map((solicitud) => (
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

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Seguimiento:</p>
                    <div className="space-y-3">
                      {solicitud.estado === 'nuevo' && !solicitud.revisado_por && !solicitud.contactado_por && (
                        <div className="text-center py-2">
                          <p className="text-xs text-gray-500 italic">Sin seguimiento registrado aún</p>
                        </div>
                      )}

                      {solicitud.revisado_por && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-700 mb-2">
                            <User className="h-4 w-4 text-yellow-600" />
                            <span className="font-semibold">Revisado por:</span>
                            <span>{userEmails[solicitud.revisado_por] || 'Cargando...'}</span>
                          </div>
                          {solicitud.fecha_revision && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(solicitud.fecha_revision).toLocaleString('es-ES')}</span>
                            </div>
                          )}
                          {solicitud.accion_tomada && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Acción tomada:</p>
                              <p className="text-xs text-gray-600 bg-white rounded px-2 py-1">{solicitud.accion_tomada}</p>
                            </div>
                          )}
                          {solicitud.notas_revision && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Notas de revisión:</p>
                              <p className="text-xs text-gray-600 bg-white rounded px-2 py-1">{solicitud.notas_revision}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {solicitud.contactado_por && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-700 mb-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">Contactado por:</span>
                            <span>{userEmails[solicitud.contactado_por] || 'Cargando...'}</span>
                          </div>
                          {solicitud.fecha_contacto && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(solicitud.fecha_contacto).toLocaleString('es-ES')}</span>
                            </div>
                          )}
                          {solicitud.notas_contacto && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Notas de contacto:</p>
                              <p className="text-xs text-gray-600 bg-white rounded px-2 py-1">{solicitud.notas_contacto}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setExpandedLogId(expandedLogId === solicitud.id ? null : solicitud.id)}
                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Ver historial de actividad"
                  >
                    <History className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(solicitud.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar solicitud"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {expandedLogId === solicitud.id && (
                <div className="mb-4">
                  <ActivityLogViewer solicitudId={solicitud.id} />
                </div>
              )}

              {editingId === solicitud.id ? (
                <div className="pt-4 border-t space-y-3">
                  {editingEstado === 'revisado' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Acción tomada:
                        </label>
                        <input
                          type="text"
                          value={accionTomada}
                          onChange={(e) => setAccionTomada(e.target.value)}
                          placeholder="Ej: Propuesta enviada, Requiere más información, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Notas de revisión:
                        </label>
                        <textarea
                          value={notasRevision}
                          onChange={(e) => setNotasRevision(e.target.value)}
                          placeholder="Añade notas adicionales sobre la revisión..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {editingEstado === 'contactado' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Notas de contacto:
                      </label>
                      <textarea
                        value={notasContacto}
                        onChange={(e) => setNotasContacto(e.target.value)}
                        placeholder="Describe el contacto realizado, acuerdos, próximos pasos..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(solicitud.id, editingEstado)}
                      className="px-4 py-2 bg-fortunna-red text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
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
                    Marcar como Nuevo
                  </button>
                  <button
                    onClick={() => startEditing(solicitud, 'revisado')}
                    disabled={solicitud.estado === 'revisado'}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      solicitud.estado === 'revisado'
                        ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    Marcar como Revisado
                  </button>
                  <button
                    onClick={() => startEditing(solicitud, 'contactado')}
                    disabled={solicitud.estado === 'contactado'}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      solicitud.estado === 'contactado'
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-800'
                    }`}
                  >
                    Marcar como Contactado
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
