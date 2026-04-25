'use client';

import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Zap, Activity, 
  Terminal, Cpu, HardDrive, RefreshCcw, 
  Save, AlertCircle, Bot, Radio, Power 
} from 'lucide-react';

export default function BotTab() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApply = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      
      {/* Tab Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
             <Sparkles size={20} />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tight">NEXUS Master Control</h2>
        </div>
        <p className="text-gray-500 text-sm pl-12 font-medium">Globale Systemsteuerung und Bot-Integritätsverwaltung.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Customization */}
        <div className="lg:col-span-2 space-y-8">
           
           <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Bot size={140} className="text-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-10">
                 <div className="relative shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.5rem] border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                       <Bot size={48} className="text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-[10px] font-black text-white px-3 py-1 rounded-lg border border-white/20 shadow-xl uppercase tracking-widest">Master</div>
                 </div>

                 <div className="flex-1 space-y-6">
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tight">System Identity</h3>
                       <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Global Operator Interface</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Bot Name</label>
                          <input 
                            type="text" 
                            defaultValue="NEXUS Protocol"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-inner"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Version Hash</label>
                          <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-gray-500 font-mono">
                             #V2.4.0-STABLE
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Shards</p>
                    <p className="text-xl font-bold text-white mt-1">01/01</p>
                 </div>
                 <div className="text-center border-l border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Memory</p>
                    <p className="text-xl font-bold text-white mt-1">124MB</p>
                 </div>
                 <div className="text-center border-l border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">API Latency</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">12ms</p>
                 </div>
                 <div className="text-center border-l border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Servers</p>
                    <p className="text-xl font-bold text-white mt-1">1,248</p>
                 </div>
              </div>
           </div>

           {/* Global Presence Config */}
           <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl relative">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <Radio className="text-orange-400" size={24} />
                    <h3 className="text-lg font-bold text-white">Präsenz & Status</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Broadcasting</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Status Text</label>
                       <input 
                         type="text" 
                         defaultValue="nexus-os-system.com | {servers} Server"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner font-medium"
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Activity Typ</label>
                       <select className="w-full bg-[#1a1b1e] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none appearance-none font-bold">
                          <option>Watching</option>
                          <option>Playing</option>
                          <option>Streaming</option>
                          <option>Competing</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Danger Zone & System Tools */}
        <div className="space-y-8">
           
           <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[3rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                 <AlertCircle className="text-rose-500" size={24} />
                 <h3 className="text-lg font-bold text-white tracking-tight leading-tight">Emergency Control</h3>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed italic">Kritische Systemaktionen, die die globale Bot-Verfügbarkeit beeinflussen.</p>
              
              <div className="space-y-3 pt-4 border-t border-rose-500/10">
                 <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-rose-500/10 rounded-2xl border border-white/5 hover:border-rose-500/20 transition-all text-sm group">
                    <span className="text-gray-400 group-hover:text-white font-bold transition-colors">Soft Reboot</span>
                    <RefreshCcw size={16} className="text-gray-700 group-hover:text-rose-500 transition-transform group-active:rotate-180 duration-500" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-rose-500/20 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-all text-sm group">
                    <span className="text-gray-400 group-hover:text-white font-bold transition-colors">System Shutdown</span>
                    <Power size={16} className="text-gray-700 group-hover:text-rose-500 transition-colors" />
                 </button>
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] shadow-xl space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Hardware Allocation</h3>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-500">Node Cluster #1</span>
                       <span className="text-white">Active</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500/40 rounded-full" style={{ width: '82%' }} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-500">Database Pool</span>
                       <span className="text-white tracking-tighter">Healthy</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500/40 rounded-full" style={{ width: '45%' }} />
                    </div>
                 </div>
              </div>
           </div>

           <button 
              onClick={handleApply}
              disabled={isUpdating}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black px-6 py-4 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3"
           >
              {isUpdating ? <RefreshCcw size={20} className="animate-spin" /> : <Save size={20} />}
              {isUpdating ? 'Applying...' : 'Master Save'}
           </button>

        </div>

      </div>

    </div>
  );
}
