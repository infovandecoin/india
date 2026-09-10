import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-14 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-4 gap-2 transition-all duration-300">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl border text-xs font-medium animate-float ${
            toast.type === 'gold'
              ? 'bg-[#181C28]/95 border-[#FF9933]/50 text-white shadow-gold-glow'
              : toast.type === 'success'
              ? 'bg-[#10241E]/95 border-[#10B981]/50 text-emerald-300'
              : 'bg-[#141724]/95 border-white/20 text-slate-200'
          }`}
        >
          {toast.type === 'gold' ? (
            <Sparkles className="w-4 h-4 text-[#FF9933] shrink-0 animate-spin-slow" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
