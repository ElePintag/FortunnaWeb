'use client';

import { useEffect, useState } from 'react';
import { getAllLogs, deleteLog, SystemLog } from '@/lib/supabase';
import { Trash2, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

export default function LogsManager() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [moduloFilter, setModuloFilter] = useState<string>('');

  useEffect(() => {
    loadLogs();
  }, [tipoFilter, moduloFilter]);

  const loadLogs = async () => {
    try {
      const filters: any = {};
      if (tipoFilter) filters.tipo = tipoFilter;
      if (moduloFilter) filters.modulo = moduloFilter;

      const data = await getAllLogs(filters);
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este log?')) {
      try {
        await deleteLog(id);
        await loadLogs();
      } catch (error) {
        console.error('Error deleting log:', error);
        alert('Error al eliminar el log');
      }
    }
  };

  const clearFilters = () => {
    setTipoFilter('');
    setModuloFilter('');
  };

  const getLogTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user_action':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLogTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'success':
        return 'Éxito';
      case 'info':
        return 'Información';
      case 'user_action':
        return 'Acción de Usuario';
      default:
        return tipo;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando logs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Logs del Sistema</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
            >
              <option value="">Todos los tipos</option>
              <option value="error">Error</option>
              <option value="warning">Advertencia</option>
              <option value="success">Éxito</option>
              <option value="info">Información</option>
              <option value="user_action">Acción de Usuario</option>
            </select>
          </div>
          <div>
            <select
              value={moduloFilter}
              onChange={(e) => setModuloFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
            >
              <option value="">Todos los módulos</option>
              <option value="terrenos">Terrenos</option>
              <option value="slides">Slides</option>
              <option value="users">Usuarios</option>
              <option value="nosotros">Nosotros</option>
              <option value="aplicaciones">Aplicaciones</option>
              <option value="compra_venta">Compra/Venta</option>
              <option value="configuracion">Configuración</option>
              <option value="auth">Autenticación</option>
            </select>
          </div>
          {(tipoFilter || moduloFilter) && (
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No se encontraron logs
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`rounded-lg shadow-md p-4 border ${getLogTypeColor(log.tipo)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white bg-opacity-50">
                      {getLogTypeLabel(log.tipo)}
                    </span>
                    <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-white bg-opacity-50">
                      {log.modulo}
                    </span>
                    <span className="text-xs text-gray-600">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </span>
                  </div>

                  <p className="font-semibold mb-1">{log.mensaje}</p>

                  {log.usuario_email && (
                    <p className="text-sm opacity-75">Usuario: {log.usuario_email}</p>
                  )}

                  {log.detalles && (
                    <details className="mt-2">
                      <summary className="text-sm font-semibold cursor-pointer hover:underline">
                        Ver detalles
                      </summary>
                      <pre className="mt-2 text-xs bg-white bg-opacity-50 p-3 rounded overflow-x-auto">
                        {JSON.stringify(log.detalles, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Total: {logs.length} log{logs.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
