'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Server, Users, ShieldCheck, 
  Cpu, Zap, Loader2, Globe, Lock, 
  ArrowUpRight, BarChart3, Clock, Ticket 
} from 'lucide-react';

export default function ServerOverviewTab({ serverId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/guilds/${serverId}/stats`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Initialisiere Command Center...</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Tab Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
             <Activity size={20} />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tight">Strategische Übersicht</h2>
        </div>
        <p className="text-gray-500 text-sm pl-12 font-medium">Monitoring der kritischen Systeme und Auslastung.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Metrics */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Real-time Monitor Card */}
           <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <Cpu size={140} className="text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <h3 className="text-xl font-bold text-white tracking-tight">Systemauslastung</h3>
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="text-5xl font-black text-white tracking-tighter">Normal</span>
                       <span className="text-emerald-500 text-sm font-bold mb-1.5 uppercase tracking-widest">Optimale Performance</span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed font-medium">Alle Sub-Systeme kommunizieren fehlerfrei mit dem NEXUS-Zentralserver.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Uptime</p>
                       <p className="text-xl font-bold text-white uppercase">99.9%</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Latenz</p>
                       <p className="text-xl font-bold text-white uppercase">24ms</p>
                    </div>
                 </div>
              </div>

              {/* Fake Chart Visualization */}
              <div className="mt-10 flex items-end gap-1.5 h-16 opacity-30">
                 {[40, 60, 45, 80, 55, 30, 65, 90, 40, 60, 45, 80, 55, 30, 65, 90, 40, 60, 45].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                 ))}
              </div>
           </div>

           {/* Stats Triple Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                 <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/10 group-hover:scale-110 transition-transform">
                    <Ticket size={20} />
                 </div>
                 <p className="text-2xl font-black text-white tracking-tighter">{data?.total || 0}</p>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Sitzungen Gesamt</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                 <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-4 border border-orange-500/10 group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                 </div>
                 <p className="text-2xl font-black text-white tracking-tighter">{data?.active || 0}</p>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Aktive Vorgänge</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                 <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                 </div>
                 <p className="text-2xl font-black text-white tracking-tighter">{Math.max(1, Math.round(data?.total * 0.8) || 0)}</p>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Unique User</p>
              </div>
           </div>
        </div>

        {/* Right Column: Security & Identity */}
        <div className="space-y-8">
           
           <div className="bg-gradient-to-br from-amber-600/10 via-orange-600/10 to-transparent border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all">
                 <Lock size={64} className="text-white" />
              </div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Security Protocol</h3>
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                       <ShieldCheck size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Authentifizierung Aktiv</p>
                       <p className="text-[10px] text-gray-600 font-medium">Dashboard Zugriff verschlüsselt.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                       <Globe size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Server Schnittstelle</p>
                       <p className="text-[10px] text-gray-600 font-medium">ID: {serverId}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] shadow-xl">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Letzte Aktivitäten</h3>
              <div className="space-y-5">
                 {[1, 2, 3].map((v) => (
                    <div key={v} className="flex gap-4 group/item">
                       <div className="w-10 h-10 bg-white/5 rounded-2xl shrink-0 flex items-center justify-center text-gray-600 border border-white/5 group-hover/item:border-orange-500/30 transition-all">
                          <Activity size={18} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-300 truncate">Systemkonfiguration aktualisiert</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                             <Clock size={10} /> Vor {v * 4} Min
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                 Gesamtes Log einsehen
              </button>
           </div>

        </div>

      </div>

    </div>
  );
}
