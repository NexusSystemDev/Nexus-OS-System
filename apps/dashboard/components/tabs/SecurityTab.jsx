'use client';

import React from 'react';
import { 
  ShieldCheck, ShieldAlert, UserCheck, 
  Lock, Cloud, UserMinus, ShieldQuestion,
  AlertTriangle, History, Shield, Info
} from 'lucide-react';

export default function SecurityTab({ config, updateConfig }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateConfig({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5">
             <ShieldCheck size={20} />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tight">Nexus Security Hub</h2>
        </div>
        <p className="text-gray-500 text-sm pl-12 font-medium">Härte dein System mit professionellen Sicherheits-Protokollen ab.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Proxy & Alt Protection Side */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-[#111214]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <UserCheck size={120} className="text-white" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
               <div className="space-y-1">
                  <h1 className="text-xl font-bold text-white tracking-tight">Proxy Protection</h1>
                  <p className="text-xs text-gray-500 font-medium">Erkennt und blockiert Alt-Accounts & Proxys.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="proxyProtectionEnabled"
                    checked={config.proxyProtectionEnabled || false}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white" />
               </label>
            </div>

            <div className={`space-y-8 relative z-10 transition-all duration-500 ${config.proxyProtectionEnabled ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
               <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-rose-400">
                     <Lock size={16} />
                     <span className="text-xs font-black uppercase tracking-widest">Mindestalter des Accounts</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-4xl font-black text-white">{config.minAccountAge || 0} <span className="text-lg text-gray-600">Tage</span></span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">Empfohlen: 7+ Tage</span>
                     </div>
                     <input 
                        type="range" 
                        name="minAccountAge"
                        min="0" 
                        max="365" 
                        value={config.minAccountAge || 0}
                        onChange={handleChange}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-rose-500"
                     />
                     <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        <span>Neu (0)</span>
                        <span>1 Jahr (365)</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <AlertTriangle className="text-amber-500/50 shrink-0 mt-1" size={18} />
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                     Accounts, die jünger als das eingestellte Alter sind, werden sofort blockiert. Sie erhalten eine Nachricht mit dem Grund für die Ablehnung.
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-[#111214]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
             <div className="flex items-center gap-4 text-orange-400 mb-2">
                <ShieldQuestion size={24} />
                <h3 className="text-xl font-bold text-white tracking-tight">Regelwerk-Filter</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] opacity-40">
                   <span className="text-xs font-bold text-gray-400 block mb-1">VPN Detection</span>
                   <span className="text-[9px] bg-white/5 text-gray-600 px-2 py-0.5 rounded-lg font-black uppercase">Enterprise</span>
                </div>
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] opacity-40">
                   <span className="text-xs font-bold text-gray-400 block mb-1">Avatar Required</span>
                   <span className="text-[9px] bg-white/5 text-gray-600 px-2 py-0.5 rounded-lg font-black uppercase">Demnächst</span>
                </div>
             </div>
          </div>

        </div>

        {/* Global Blacklist & Sync Side */}
        <div className="lg:col-span-5 space-y-8">
           
           <div className="bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-10">
                 <Cloud size={200} className="text-rose-500" />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                       Global Cloud Sync
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </h3>
                    <p className="text-xs text-rose-500/70 font-bold uppercase tracking-widest">Crowdsourced Protection</p>
                 </div>

                 <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    Synchronisiere deine Blacklist mit dem NEXUS Network. Bekannte Griefer, Spammer und bösartige Nutzer werden automatisch auf allen teilnehmenden Servern blockiert.
                 </p>

                 <div className="pt-4">
                    <button 
                       onClick={() => updateConfig({ globalBlacklistEnabled: !config.globalBlacklistEnabled })}
                       className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 border ${
                         config.globalBlacklistEnabled 
                          ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]' 
                          : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                       }`}
                    >
                       {config.globalBlacklistEnabled ? 'Cloud Sync Aktiviert' : 'Cloud Sync Deaktiviert'}
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-[#111214]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                    <UserMinus size={18} className="text-gray-500" />
                    Lokale Blacklist
                 </h3>
                 <span className="text-[10px] bg-white/5 text-gray-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                    {config.blacklists?.length || 0} Gebannt
                 </span>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {config.blacklists && config.blacklists.length > 0 ? (
                   config.blacklists.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-300">{item.targetId}</span>
                           <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{item.type} • {item.reason || 'Kein Grund'}</span>
                        </div>
                        <div className="p-2 text-rose-500/30 hover:text-rose-500 transition-colors cursor-pointer">
                           <Shield size={16} />
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Keine lokalen Bans vorhanden</p>
                   </div>
                 )}
              </div>
              
              <button className="w-full py-3.5 bg-white/[0.02] border border-white/5 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
                 Eintrag Hinzufügen
              </button>
           </div>

        </div>
      </div>

    </div>
  );
}
