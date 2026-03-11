'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, LogOut, Image as ImageIcon, LayoutGrid as Layout, Users, FileText, Briefcase, Settings, Chrome as Home, FileSearch } from 'lucide-react';
import SlidesManager from '@/components/admin/SlidesManager';
import TerrenosManager from '@/components/admin/TerrenosManager';
import UsersManager from '@/components/admin/UsersManager';
import NosotrosManager from '@/components/admin/NosotrosManager';
import TrabajeConNosotrosManager from '@/components/admin/TrabajeConNosotrosManager';
import ConfiguracionManager from '@/components/admin/ConfiguracionManager';
import CompraVentaManager from '@/components/admin/CompraVentaManager';
import LogsManager from '@/components/admin/LogsManager';

type Tab = 'slides' | 'terrenos' | 'users' | 'nosotros' | 'trabajeConNosotros' | 'compraVenta' | 'configuracion' | 'logs';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, isAdmin, isOperador, userRole, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(isAdmin ? 'slides' : 'terrenos');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fortunna-red"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-fortunna-red" />
              <div>
                <h1 className="text-2xl font-bold text-fortunna-red">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">
                  {user.email}
                  {userRole && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      userRole === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userRole === 'admin' ? 'Administrador' : 'Operador'}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('slides')}
                  className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                    activeTab === 'slides'
                      ? 'border-fortunna-red text-fortunna-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layout className="h-5 w-5" />
                  <span>Slides del Banner</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('terrenos')}
                className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                  activeTab === 'terrenos'
                    ? 'border-fortunna-red text-fortunna-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                <span>Terrenos</span>
              </button>

              <button
                onClick={() => setActiveTab('compraVenta')}
                className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                  activeTab === 'compraVenta'
                    ? 'border-fortunna-red text-fortunna-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Compra/Venta</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                      activeTab === 'users'
                        ? 'border-fortunna-red text-fortunna-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Usuarios</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('nosotros')}
                    className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                      activeTab === 'nosotros'
                        ? 'border-fortunna-red text-fortunna-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Nosotros</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                      activeTab === 'logs'
                        ? 'border-fortunna-red text-fortunna-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileSearch className="h-5 w-5" />
                    <span>Logs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('configuracion')}
                    className={`pb-4 px-1 border-b-2 font-semibold flex items-center space-x-2 transition-colors ${
                      activeTab === 'configuracion'
                        ? 'border-fortunna-red text-fortunna-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        <div>
          {activeTab === 'slides' && <SlidesManager />}
          {activeTab === 'terrenos' && <TerrenosManager />}
          {activeTab === 'users' && <UsersManager />}
          {activeTab === 'nosotros' && <NosotrosManager />}
          {activeTab === 'trabajeConNosotros' && <TrabajeConNosotrosManager />}
          {activeTab === 'compraVenta' && <CompraVentaManager />}
          {activeTab === 'configuracion' && <ConfiguracionManager />}
          {activeTab === 'logs' && <LogsManager />}
        </div>
      </div>
    </div>
  );
}
