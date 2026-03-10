'use client';

import { useEffect, useState } from 'react';
import { getActivityLogs, getUserEmail, ActivityLog } from '@/lib/supabase';
import { Clock, User, FileText, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface ActivityLogViewerProps {
  solicitudId: string;
}

export default function ActivityLogViewer({ solicitudId }: ActivityLogViewerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadLogs();
  }, [solicitudId]);

  const loadLogs = async () => {
    try {
      const data = await getActivityLogs(solicitudId);
      setLogs(data);

      const userIds = new Set<string>();
      data.forEach((log) => {
        if (log.user_id) userIds.add(log.user_id);
      });

      const emails: { [key: string]: string } = {};
      for (const userId of Array.from(userIds)) {
        const email = await getUserEmail(userId);
        if (email) emails[userId] = email;
      }
      setUserEmails(emails);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForAction = (accion: string) => {
    switch (accion) {
      case 'solicitud_creada':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'cambio_estado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'nota_revision_agregada':
        return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatAccion = (accion: string) => {
    const acciones: { [key: string]: string } = {
      'solicitud_creada': 'Solicitud Creada',
      'cambio_estado': 'Cambio de Estado',
      'nota_revision_agregada': 'Nota de Revisión',
    };
    return acciones[accion] || accion;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-500 text-center">Cargando historial...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-500 text-center">No hay actividad registrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
          <Clock className="h-4 w-4 text-fortunna-red" />
          <span>Historial de Actividad</span>
        </h3>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className={`flex space-x-3 pb-3 ${index !== logs.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIconForAction(log.accion)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700">
                    {formatAccion(log.accion)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {log.descripcion && (
                  <p className="text-xs text-gray-600 mb-1">
                    {log.descripcion}
                  </p>
                )}

                {log.user_id && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{userEmails[log.user_id] || 'Usuario desconocido'}</span>
                  </div>
                )}

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    {log.metadata.estado_anterior && log.metadata.estado_nuevo && (
                      <span className="text-gray-600">
                        <span className="font-semibold">{log.metadata.estado_anterior}</span>
                        {' → '}
                        <span className="font-semibold">{log.metadata.estado_nuevo}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
