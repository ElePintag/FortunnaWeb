'use client'

import { useEffect, useState } from 'react'
import { getConfiguracion, updateConfiguracion, type Configuracion } from '@/lib/supabase'
import { Save } from 'lucide-react'

export default function ConfiguracionManager() {
  const [configs, setConfigs] = useState<Configuracion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    loadConfigs()
  }, [])

  async function loadConfigs() {
    try {
      const data = await getConfiguracion()
      setConfigs(data)
    } catch (error) {
      console.error('Error loading configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (clave: string, valor: string) => {
    setSaving(clave)
    try {
      await updateConfiguracion(clave, valor)
      await loadConfigs()
    } catch (error) {
      console.error('Error updating config:', error)
      alert('Error al actualizar la configuración')
    } finally {
      setSaving(null)
    }
  }

  const handleChange = (clave: string, valor: string) => {
    setConfigs(configs.map(c => c.clave === clave ? { ...c, valor } : c))
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuración del Sitio</h2>

      <div className="space-y-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{config.clave}</h3>
                {config.descripcion && (
                  <p className="text-sm text-gray-600">{config.descripcion}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              {config.tipo === 'texto' && (
                <input
                  type="text"
                  value={config.valor || ''}
                  onChange={(e) => handleChange(config.clave, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              )}
              {config.tipo === 'numero' && (
                <input
                  type="number"
                  value={config.valor || ''}
                  onChange={(e) => handleChange(config.clave, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              )}
              {config.tipo === 'imagen' && (
                <input
                  type="url"
                  value={config.valor || ''}
                  onChange={(e) => handleChange(config.clave, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="URL de la imagen"
                />
              )}
              {config.tipo === 'boolean' && (
                <select
                  value={config.valor || 'false'}
                  onChange={(e) => handleChange(config.clave, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              )}

              <button
                onClick={() => handleUpdate(config.clave, config.valor || '')}
                disabled={saving === config.clave}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                <Save size={20} />
                {saving === config.clave ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        ))}

        {configs.length === 0 && (
          <p className="text-gray-600 text-center py-8">
            No hay configuraciones disponibles.
          </p>
        )}
      </div>
    </div>
  )
}
