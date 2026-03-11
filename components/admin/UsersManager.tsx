'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, UserPlus, Mail, Lock, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  app_metadata?: {
    rol?: 'admin' | 'operador' | 'user';
  };
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rol: 'operador' as 'admin' | 'operador',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;

      setUsers(authUsers as User[]);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          rol: formData.rol,
        },
        app_metadata: {
          rol: formData.rol,
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            rol: formData.rol,
            activo: true,
          });

        if (insertError) {
          console.error('Error inserting user in users table:', insertError);
        }
      }

      setFormData({ email: '', password: '', rol: 'operador' });
      setShowForm(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      await loadUsers();
    } catch (err: any) {
      alert('Error al eliminar usuario: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fortunna-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-fortunna-red" />
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-fortunna-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h3>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Rol
              </label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'operador' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
              >
                <option value="operador">Operador (Solo Terrenos y Compra/Venta)</option>
                <option value="admin">Administrador (Acceso completo)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {formData.rol === 'admin'
                  ? 'Tendrá acceso completo a todas las secciones del panel'
                  : 'Solo tendrá acceso a gestionar Terrenos y Solicitudes de Compra/Venta'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-fortunna-red text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Creando...' : 'Crear Usuario'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ email: '', password: '', rol: 'operador' });
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Rol</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Creado</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Último acceso</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const rol = user.app_metadata?.rol || 'user';
              const rolLabel = rol === 'admin' ? 'Administrador' : rol === 'operador' ? 'Operador' : 'Usuario';
              const rolColor = rol === 'admin' ? 'bg-red-100 text-red-800' : rol === 'operador' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rolColor}`}>
                      {rolLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString('es-MX')
                      : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay usuarios registrados
          </div>
        )}
      </div>
    </div>
  );
}
