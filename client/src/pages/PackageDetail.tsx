import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { MapPin, Phone, Navigation, Camera, CheckCircle, ArrowRight } from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { MapView } from '@/components/Map';
import { api } from '@/lib/api';

interface Package {
  id: number;
  // Add other properties as needed, e.g.:
  // name?: string;
  // address?: string;
  // status?: string;
  // etc.
}

export default function PackageDetail() {
  const [, params] = useRoute('/package/:id');
  const [, setLocation] = useLocation();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [pkg, setPkg] = useState<Package | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem('token');
      if (!token || !params?.id) return;
      try {
        const data = await api.getPaqueteDetalle(parseInt(params.id), token);
        setPkg(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, [params?.id]);

  const handleCapture = () => {
    // Simular captura de cámara con una imagen base64 (1x1 px PNG)
    setCapturedImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
    setShowCamera(false);
  };

  const handleDelivery = async () => {
    if (!capturedImage || !pkg) return;
    setIsDelivering(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // TODO: Replace this hardcoded base64 string with proper image capture and base64 encoding.
      // Convertir URL a base64 simulado para pasar validación (SIN PREFIJO)
      const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; 

      await api.registrarEntrega(token, {
        paquete_id: pkg.id,
        latitud_entrega: 19.3687,
        longitud_entrega: -99.1707,
        foto_evidencia_base64: base64Image,
        comentarios: "Entrega exitosa"
      });
      
      setLocation('/success');
    } catch (error) {
      console.error(error);
      setIsDelivering(false);
    }
  };

  if (!pkg) return <div className="flex justify-center p-10"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div></div>;

  if (showCamera) {
    return (
      <div className="mobile-frame bg-black flex flex-col relative">
        <div className="absolute top-4 right-4 z-50">
          <button onClick={() => setShowCamera(false)} className="text-white p-2">
            ✕
          </button>
        </div>
        <div className="flex-1 bg-gray-900 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80" 
            className="w-full h-full object-cover opacity-50"
            alt="Camera Preview"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/50 rounded-lg"></div>
          </div>
        </div>
        <div className="h-32 bg-black flex items-center justify-center">
          <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-white rounded-full active:scale-90 transition-transform"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <MobileLayout title="Detalle de Entrega" showBack hideNav>
      {/* Map Section */}
      <div className="h-48 w-full rounded-2xl overflow-hidden mb-6 neu-flat p-1">
        <div className="w-full h-full rounded-xl overflow-hidden relative">
          <img src="/map_bg.png" className="w-full h-full object-cover" alt="Map" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-full border-4 border-white shadow-lg animate-bounce"></div>
          </div>
          <button className="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow-md text-[var(--primary)] font-bold text-xs flex items-center">
            <Navigation size={12} className="mr-1" /> NAVEGAR
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="neu-flat p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-800">{pkg.destinatario_nombre}</h2>
            <p className="text-sm font-mono text-gray-400">{pkg.codigo_rastreo}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Phone size={20} />
          </button>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <MapPin className="text-[var(--primary)] mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-gray-600 font-medium leading-tight">{pkg.direccion_completa}</p>
            <p className="text-gray-400 text-sm">Ciudad de México</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Estado</p>
            <p className="text-gray-700 font-bold uppercase">{pkg.estado}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Prioridad</p>
            <p className="text-gray-700 font-bold uppercase">{pkg.prioridad}</p>
          </div>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="mb-24">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Evidencia de Entrega</h3>
        
        {capturedImage ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border-2 border-[var(--primary)]">
            <img src={capturedImage} className="w-full h-full object-cover" alt="Evidence" />
            <button 
              onClick={() => setCapturedImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            >
              ✕
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
              GPS: 19.3687° N, 99.1707° W
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowCamera(true)}
            className="w-full h-32 neu-pressed flex flex-col items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-colors border-2 border-dashed border-gray-300 hover:border-[var(--primary)]"
          >
            <Camera size={32} className="mb-2" />
            <span className="text-sm font-bold">TOMAR FOTO</span>
          </button>
        )}
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--background)] to-transparent z-40 flex justify-center">
        <div className="w-[375px] px-6">
          <button 
            onClick={handleDelivery}
            disabled={!capturedImage || isDelivering}
            className={`w-full h-14 rounded-xl flex items-center justify-center font-black text-lg shadow-lg transition-all ${
              capturedImage 
                ? 'bg-[var(--primary)] text-white active:scale-[0.98]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isDelivering ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                CONFIRMAR ENTREGA <CheckCircle size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
