'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldAlert, Home, AlertCircle } from 'lucide-react';

export default function SystemLockout({ mini = false }) {
  if (mini) {
    return (
      <div className="bg-[#111214]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
        
        <div className="relative mx-auto w-16 h-16">
           <div className="absolute inset-0 bg-rose-500/10 blur-xl animate-pulse rounded-full" />
           <div className="relative bg-[#1a1b1e] border border-rose-500/10 w-full h-full rounded-full flex items-center justify-center text-rose-500/80">
              <Lock size={24} />
           </div>
        </div>

        <div className="space-y-2">
           <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Modul Gesperrt</h2>
           <p className="text-gray-500 text-xs font-medium max-w-xs mx-auto">
             Du hast keine Berechtigung für dieses System-Modul (`TICKET_TRANSCRIPT`).
           </p>
        </div>
        
        <div className="text-[9px] text-gray-700 font-black uppercase tracking-[0.2em] pt-4">Nexus OS Security</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      <div className="max-w-md w-full bg-[#111214]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl text-center space-y-8 relative z-10">
        <div className="relative mx-auto w-24 h-24">
           <div className="absolute inset-0 bg-rose-500/20 blur-2xl animate-pulse rounded-full" />
           <div className="relative bg-[#1a1b1e] border border-rose-500/20 w-full h-full rounded-full flex items-center justify-center text-rose-500 shadow-inner">
              <Lock size={40} className="animate-bounce-subtle" />
           </div>
           <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-xl border-4 border-[#111214]">
              <ShieldAlert size={16} />
           </div>
        </div>

        <div className="space-y-3">
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">System-Sperre</h2>
           <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-[0.2em] bg-rose-500/10 py-2 px-4 rounded-full border border-rose-500/20">
              <AlertCircle size={14} />
              <span>Zugriff verweigert</span>
           </div>
        </div>

        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          Deine aktuelle Autorisierungs-Signatur verfügt nicht über die notwendigen Privilegien, um dieses System-Modul zu verwalten.
        </p>

        <div className="pt-4 space-y-4">
           <Link href="/dashboard" className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all hover:scale-[1.02] active:scale-95 group">
              <Home size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              Zurück zur Zentrale
           </Link>
           
           <div className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em]">Nexus OS Security Hub v2.4</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}
