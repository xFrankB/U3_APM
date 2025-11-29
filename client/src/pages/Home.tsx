import React from 'react';
import { useLocation } from 'wouter';
import { Package, MapPin, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

// Define the shape of a package object based on usage in this file
interface Package {
  // Add properties as needed; here's a minimal example
  id: string;
  nombre: string;
  direccion: string;
  estado: string;
  fechaEntrega?: string;
  // Add other properties as needed based on usage
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLocation('/');
      
      try {
        const data = await api.getPaquetes(token);
        setPackages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <MobileLayout title="Mis Entregas">
      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 neu-pressed h-12 flex items-center px-4 text-gray-500">
          <Search size={18} className="mr-2" />
          <input 
            type="text" 
            placeholder="Buscar paquete..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
          />
        </div>
        <button className="w-12 h-12 neu-flat flex items-center justify-center text-gray-500 active:neu-pressed">
          <Filter size={18} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="neu-flat min-w-[140px] p-4 flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase">Pendientes</span>
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          </div>
          <span className="text-3xl font-black text-gray-700">12</span>
        </div>
        <div className="neu-flat min-w-[140px] p-4 flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase">Completados</span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
          <span className="text-3xl font-black text-gray-700">5</span>
        </div>
      </div>

      {/* Package List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2">Ruta de Hoy</h2>
        
        {loading ? (
          <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div></div>
        ) : packages.map((pkg) => (
          <div 
            key={pkg.id}
            onClick={() => setLocation(`/package/${pkg.id}`)}
            className="neu-flat p-4 active:scale-[0.98] transition-transform cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-8 rounded-full ${
                  pkg.prioridad === 'urgente' ? 'bg-red-500' : 
                  pkg.prioridad === 'express' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <h3 className="font-bold text-gray-800">{pkg.destinatario_nombre}</h3>
                  <p className="text-xs font-mono text-gray-400">{pkg.codigo_rastreo}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                pkg.prioridad === 'urgente' ? 'bg-red-100 text-red-600' : 
                pkg.prioridad === 'express' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {pkg.prioridad}
              </span>
            </div>

            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{pkg.direccion_completa}</span>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200/50">
              <div className="flex gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center"><Clock size={12} className="mr-1" /> Hoy</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
