'use client'

import { useState } from 'react'
import SlidesManager from '@/components/admin/SlidesManager'
import TerrenosManager from '@/components/admin/TerrenosManager'
import NosotrosManager from '@/components/admin/NosotrosManager'
import TrabajeConNosotrosManager from '@/components/admin/TrabajeConNosotrosManager'
import CompraVentaManager from '@/components/admin/CompraVentaManager'
import ConfiguracionManager from '@/components/admin/ConfiguracionManager'

type Tab = 'slides' | 'terrenos' | 'nosotros' | 'trabaje' | 'compra-venta' | 'config'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('slides')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'slides', label: 'Slides' },
    { id: 'terrenos', label: 'Propiedades' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'trabaje', label: 'Trabaje con Nosotros' },
    { id: 'compra-venta', label: 'Compra/Venta' },
    { id: 'config', label: 'Configuración' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-400 mt-2">Gestiona el contenido de tu sitio web</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'slides' && <SlidesManager />}
            {activeTab === 'terrenos' && <TerrenosManager />}
            {activeTab === 'nosotros' && <NosotrosManager />}
            {activeTab === 'trabaje' && <TrabajeConNosotrosManager />}
            {activeTab === 'compra-venta' && <CompraVentaManager />}
            {activeTab === 'config' && <ConfiguracionManager />}
          </div>
        </div>
      </div>
    </div>
  )
}
