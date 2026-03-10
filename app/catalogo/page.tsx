'use client';

import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { getTerrenos, Terreno } from '@/lib/supabase';
import { Filter, Search } from 'lucide-react';

export default function CatalogoPage() {
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: '',
    ubicacion: '',
    precioMin: '',
    precioMax: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTerrenos();
  }, []);

  const loadTerrenos = async () => {
    setLoading(true);
    try {
      const filterObj: any = {};

      if (filters.estado) filterObj.estado = filters.estado;
      if (filters.ubicacion) filterObj.ubicacion = filters.ubicacion;
      if (filters.precioMin) filterObj.precioMin = Number(filters.precioMin);
      if (filters.precioMax) filterObj.precioMax = Number(filters.precioMax);

      const data = await getTerrenos(filterObj);
      setTerrenos(data);
    } catch (error) {
      console.error('Error loading terrenos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTerrenos();
  };

  const clearFilters = () => {
    setFilters({
      estado: '',
      ubicacion: '',
      precioMin: '',
      precioMax: '',
    });
    setTimeout(() => loadTerrenos(), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-fortunna-red">Terrenos</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Explora todas nuestras propiedades disponibles
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full md:w-auto"
          >
            <Filter className="h-5 w-5 text-fortunna-red" />
            <span className="font-semibold">
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </span>
          </button>

          {showFilters && (
            <form
              onSubmit={handleFilterSubmit}
              className="bg-white p-6 rounded-lg shadow-md mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={filters.estado}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="disponible">Disponible</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={filters.ubicacion}
                    onChange={handleFilterChange}
                    placeholder="Buscar ubicación..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Precio Mínimo
                  </label>
                  <input
                    type="number"
                    name="precioMin"
                    value={filters.precioMin}
                    onChange={handleFilterChange}
                    placeholder="$ 0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Precio Máximo
                  </label>
                  <input
                    type="number"
                    name="precioMax"
                    value={filters.precioMax}
                    onChange={handleFilterChange}
                    placeholder="$ 999,999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fortunna-red focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-fortunna-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Buscar</span>
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Limpiar Filtros
                </button>
              </div>
            </form>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fortunna-red"></div>
            <p className="mt-4 text-gray-600">Cargando terrenos...</p>
          </div>
        ) : terrenos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {terrenos.map((terreno) => (
              <PropertyCard key={terreno.id} terreno={terreno} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              No se encontraron terrenos con los filtros seleccionados
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-fortunna-red hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
