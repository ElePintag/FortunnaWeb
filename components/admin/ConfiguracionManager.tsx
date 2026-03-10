'use client';

import { useEffect, useState } from 'react';
import { getConfiguracion, updateConfiguracion, Configuracion } from '@/lib/supabase';
import { Save } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function ConfiguracionManager() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguracion();
  }, []);

  const loadConfiguracion = async () => {
    try {
      const data = await getConfiguracion();
      const configMap: Record<string, string> = {};
      data.forEach((item) => {
        configMap[item.clave] = item.valor || '';
      });
      setConfig(configMap);
    } catch (error) {
      console.error('Error loading configuracion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [clave, valor] of Object.entries(config)) {
        await updateConfiguracion(clave, valor);
      }
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving configuracion:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (clave: string, valor: string) => {
    setConfig((prev) => ({
      ...prev,
      [clave]: valor,
    }));
  };

  if (loading) {
    return <div className="text-center py-12">Cargando configuración...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Configuración del Sitio</h2>
        <p className="text-gray-600 mt-2">
          Gestiona la configuración general del sitio web
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Logo del Sitio</label>
            <ImageUploader
              currentImage={config.logo_url || ''}
              onImageUploaded={(url) => handleChange('logo_url', url)}
              label="Logo"
            />
            <p className="text-sm text-gray-500 mt-2">
              Sube el logo de tu empresa (recomendado: 200x60px, formato PNG con fondo transparente)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Número de WhatsApp</label>
            <input
              type="text"
              value={config.whatsapp_number || ''}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              placeholder="+593999999999"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
            />
            <p className="text-sm text-gray-500 mt-1">
              Incluye el código de país (ej: +593 para Ecuador)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email de Contacto</label>
            <input
              type="email"
              value={config.email_contacto || ''}
              onChange={(e) => handleChange('email_contacto', e.target.value)}
              placeholder="contacto@fortunna.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email de RRHH</label>
            <input
              type="email"
              value={config.email_rrhh || ''}
              onChange={(e) => handleChange('email_rrhh', e.target.value)}
              placeholder="rrhh@fortunna.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red"
            />
            <p className="text-sm text-gray-500 mt-1">
              Este email recibirá las aplicaciones de trabajo
            </p>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-fortunna-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
