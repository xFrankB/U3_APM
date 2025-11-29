import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { api } from '@/lib/api';

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('agente', JSON.stringify(data));
      setLocation('/home');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col items-center justify-center h-full pt-10">
        {/* Logo Area */}
        <div className="w-32 h-32 neu-convex rounded-full flex items-center justify-center mb-8 p-6">
          <img src="/logo.png" alt="Paquexpress" className="w-full h-full object-contain opacity-90" />
        </div>

        <h1 className="text-2xl font-black text-gray-700 mb-2 tracking-tight">PAQUEXPRESS</h1>
        <p className="text-gray-400 text-sm mb-12 font-medium">AGENT PORTAL v2.0</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-wider">Usuario</label>
            <div className="neu-pressed flex items-center px-4 py-3 text-gray-600">
              <User size={20} className="text-gray-400 mr-3" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jperez"
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium placeholder-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-wider">Contraseña</label>
            <div className="neu-pressed flex items-center px-4 py-3 text-gray-600">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium placeholder-gray-300"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center text-[var(--destructive)] text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full neu-flat h-14 mt-8 flex items-center justify-center text-[var(--primary)] font-bold text-lg active:scale-[0.98] transition-transform disabled:opacity-70"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                INICIAR SESIÓN <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-auto pb-8 text-center">
          <p className="text-xs text-gray-400">¿Olvidaste tu contraseña?</p>
          <p className="text-xs text-gray-400 mt-1">Contactar Soporte Técnico</p>
        </div>
      </div>
    </MobileLayout>
  );
}
