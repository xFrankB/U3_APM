import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Check, Home } from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import confetti from 'canvas-confetti';

export default function Success() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b00', '#2d3748', '#ffffff']
    });
  }, []);

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <Check size={64} className="text-green-600" strokeWidth={4} />
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-2">¡ENTREGA EXITOSA!</h1>
        <p className="text-gray-500 mb-12">La información ha sido sincronizada correctamente con el servidor central.</p>

        <div className="w-full neu-flat p-6 mb-8 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">ID Transacción</p>
          <p className="font-mono text-gray-700 mb-4">TX-982374-2024</p>
          
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Hora de Registro</p>
          <p className="font-mono text-gray-700">10:42:15 AM</p>
        </div>

        <button 
          onClick={() => setLocation('/home')}
          className="w-full neu-flat h-14 flex items-center justify-center text-gray-700 font-bold active:scale-[0.98] transition-transform"
        >
          <Home size={20} className="mr-2" /> VOLVER AL INICIO
        </button>
      </div>
    </MobileLayout>
  );
}
