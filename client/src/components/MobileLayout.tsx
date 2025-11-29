import React from 'react';
import { useLocation } from 'wouter';
import { Package, Map, Camera, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  hideNav?: boolean;
}

export default function MobileLayout({ children, title, showBack, hideNav }: MobileLayoutProps) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Package, label: 'Paquetes', path: '/home' },
    { icon: Map, label: 'Mapa', path: '/map' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className="mobile-frame flex flex-col">
      {/* Status Bar Simulation */}
      <div className="h-12 w-full flex justify-between items-center px-6 pt-2 text-xs font-bold text-gray-500 select-none">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="w-6 h-3 rounded-sm border border-gray-400 relative">
            <div className="absolute inset-0.5 bg-gray-800 rounded-sm w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      {title && (
        <div className="px-6 py-4 flex items-center justify-between">
          {showBack ? (
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 neu-flat flex items-center justify-center text-gray-600 active:neu-pressed transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h1 className="text-lg font-bold text-gray-700 tracking-wide">{title}</h1>
          <div className="w-10" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
        {children}
      </div>

      {/* Bottom Navigation */}
      {!hideNav && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[var(--background)] flex justify-around items-center px-4 pb-4 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "neu-pressed text-[var(--primary)]" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full opacity-50"></div>
    </div>
  );
}
