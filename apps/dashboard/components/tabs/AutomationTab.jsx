'use client';

import React from 'react';
import { Cpu, Zap, Bell, Clock, ShieldCheck, Settings2, Sparkles, Filter, Workflow } from 'lucide-react';

export default function AutomationTab({ config, updateConfig }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateConfig({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
             <Cpu size={20} />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tight">System-Automation</h2>
        </div>
        <p className="text-gray-500 text-sm pl-12 font-medium">Verwalte intelligente Prozesse, um das Team zu entlasten.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Anti-Ghosting / Auto-Ping Card */}
        <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <Bell size={100} className="text-white" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              Auto-Ping System
              <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-lg border border-orange-500/20 font-black tracking-widest uppercase">Intelligent</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">Benachrichtigt das Team automatisch bei Inaktivität.</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300">Unclamed-Erinnerung</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="autoPingEnabled"
                      checked={config.autoPingEnabled || false}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 peer-checked:after:bg-white" />
                  </label>
               </div>
               <p className="text-[10px] text-gray-600 leading-relaxed font-bold">Sendet automatisch einen Ping in den Ticket-Kanal, wenn kein Teammitglied das Ticket innerhalb des Zeitraums übernimmt.</p>
            </div>

            <div className={`space-y-2 transition-opacity ${config.autoPingEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                 <Clock size={12} /> Zeitlimit (Minuten)
               </label>
               <input 
                  type="number" 
                  name="autoPingTime"
                  value={config.autoPingTime || 30}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner"
                  placeholder="30"
               />
            </div>
          </div>
        </div>

        {/* Auto-Close Card */}
        <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-white">
            <Workflow size={100} />
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              Auto-Close
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-black tracking-widest uppercase">Inaktivität</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">Schließt Tickets automatisch nach einer gewissen Zeit ohne Antwort.</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300">Automatisches Schließen</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="autoCloseEnabled"
                      checked={config.autoCloseEnabled || false}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
                  </label>
               </div>
               <p className="text-[10px] text-gray-600 leading-relaxed font-bold">Schließt Tickets automatisch, wenn seit dem eingestellten Zeitraum keine Nachricht mehr gesendet wurde.</p>
            </div>

            <div className={`space-y-2 transition-opacity ${config.autoCloseEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                 <Clock size={12} /> Zeitlimit (Stunden)
               </label>
               <input 
                  type="number" 
                  name="autoCloseHours"
                  value={config.autoCloseHours || 48}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner"
                  placeholder="48"
               />
            </div>
          </div>
        </div>

      </div>

      {/* Experimental Features Area */}
      <div className="p-10 border border-white/5 rounded-[3rem] bg-gradient-to-br from-amber-500/5 to-transparent relative group">
         <div className="flex items-center gap-4 mb-8">
            <Sparkles className="text-orange-400" size={20} />
            <h3 className="text-2xl font-black text-white tracking-tight">Lab-Eigenschaften</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Advanced Metadata Export</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Prototyping</span>
                   </div>
                   <div className="w-12 h-6 bg-white/5 rounded-full border border-white/10" />
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Sammelt zusätzliche Metrik-Daten im Hintergrund, um die Effizienz der Supporter über einen längeren Zeitraum zu messen.</p>
             </div>
         </div>
         
         <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-5 transition-opacity">
            <ShieldCheck size={120} />
         </div>
      </div>

    </div>
  );
}
