'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Images } from 'lucide-react';

interface MultipleImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  label?: string;
}

export default function MultipleImageUploader({ images, onImagesChange, label = 'Imágenes' }: MultipleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Por favor selecciona solo archivos de imagen válidos');
      return;
    }

    const largeFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setError('Algunos archivos son muy grandes. Máximo 10MB por archivo');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold mb-2">
        <Images className="inline h-4 w-4 mr-1" />
        {label}
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Imagen ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Eliminar imagen"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="multiple-file-upload"
        />
        <label
          htmlFor="multiple-file-upload"
          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-fortunna-red hover:bg-red-50 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fortunna-red"></div>
              <span className="text-sm font-medium">Subiendo imágenes...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Agregar imágenes
              </span>
            </>
          )}
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Selecciona múltiples imágenes. JPG, PNG, WEBP o GIF. Máximo 10MB cada una.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
