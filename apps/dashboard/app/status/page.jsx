'use client';

import React from 'react';
import { Activity, Shield, Cpu, Database, Globe, ArrowLeft, CheckCircle2, History } from 'lucide-react';
import Link from 'next/link';

export default function StatusPage() {
  const components = [
    { name: "Master API", status: "Operational", uptime: "99.99%", load: "12%", icon: <Globe size={20} className="text-emerald-400" /> },
    { name: "Bot Clusters (EU-1)", status: "Operational", uptime: "99.95%", load: "45%", icon: <Cpu size={20} className="text-emerald-400" /> },
    { name: "Database Matrix", status: "Operational", uptime: "100%", load: "8%", icon: <Database size={20} className="text-emerald-400" /> },
    { name: "Dashboard UI", status: "Operational", uptime: "99.99%", load: "2%", icon: <Activity size={20} className="text-emerald-400" /> }
  ];

  const recentEvents = [
    { time: "Vor 2 Std.", type: "Maintenance", title: "API Gateway Optimization", status: "Completed" },
    { time: "Gestern", type: "Update", title: "NEXUS Core v2.4 Deployment", status: "Success" },
    { time: "Vor 3 Tagen", type: "Security", title: "Global Blacklist Sync", status: "Completed" }
  ];

  return (
    <main className="min-h-screen bg-[#090a0b] text-white pt-24 pb-20 px-6 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Back Link & Header */}
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Zurück zur Zentrale</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-emerald-400 font-bold tracking-widest uppercase text-[10px]">
                <Activity size={14} /> Global System Health
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">System Status</h1>
              <p className="text-gray-400 max-w-2xl leading-relaxed text-lg font-medium">
                Aktuelle Informationen zur Performance und Verfügbarkeit aller NEXUS-Komponenten.
              </p>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-5 rounded-[2rem] flex items-center gap-4 backdrop-blur-3xl shadow-2xl shadow-emerald-500/5">
               <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
               <div className="flex flex-col">
                  <span className="text-lg font-black text-emerald-400 tracking-tight leading-none">All Systems Operational</span>
                  <span className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.2em] mt-1">Updates every 30 seconds</span>
               </div>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {components.map((comp, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/20 transition-all duration-500 group">
               <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                     {comp.icon}
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Uptime</span>
                     <span className="text-sm font-bold text-gray-400 mt-1">{comp.uptime}</span>
                  </div>
               </div>
               
               <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">{comp.name}</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span className="text-[11px] font-black text-emerald-500/80 uppercase tracking-widest">{comp.status}</span>
                  </div>
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                     <span>Load Factor</span>
                     <span>{comp.load}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500/30 rounded-full" style={{ width: comp.load }} />
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* History & Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4">
                 <History className="text-gray-500" size={24} />
                 <h2 className="text-3xl font-black tracking-tighter">Recent Updates</h2>
              </div>
              <div className="space-y-4">
                 {recentEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-colors">
                       <div className="w-16 text-[10px] font-black text-gray-600 uppercase tracking-widest shrink-0">
                          {event.time}
                       </div>
                       <div className="h-10 w-px bg-white/5" />
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-black text-gray-500 uppercase tracking-widest">{event.type}</span>
                             <h4 className="font-bold text-gray-200">{event.title}</h4>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{event.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4">
                 <Shield className="text-orange-400" size={24} />
                 <h2 className="text-3xl font-black tracking-tighter">Security</h2>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-1 rounded-[2.5rem]">
                 <div className="bg-[#0b0c0e]/90 backdrop-blur-xl p-8 rounded-[2.4rem] border border-white/5 space-y-6">
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                       Der NEXUS-Cluster wird kontinuierlich auf Sicherheitslücken und Performance-Engpässe überwacht. 
                       Alle Datenverbindungen sind mit **TLS 1.3** verschlüsselt.
                    </p>
                    <div className="flex items-center gap-3">
                       <img src="https://img.shields.io/badge/Security-Verified-emerald?style=flat-square" alt="Shield" />
                       <img src="https://img.shields.io/badge/Architecture-Distributed-blue?style=flat-square" alt="Arch" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer info in page */}
        <div className="text-center pt-20 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">NEXUS Operations Center | Live Metrics Center</p>
        </div>

      </div>
    </main>
  );
}
