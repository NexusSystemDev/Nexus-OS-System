'use client';

import React from 'react';
import { Settings, Bell, Shield, Hash, LogIn, FileText, Globe } from 'lucide-react';

export default function GeneralTab({ config, updateConfig }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateConfig({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Tab Header */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5">
           <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
             <Settings size={16} />
           </div>
           <h2 className="text-xl font-black text-white tracking-tight">Allgemeine Konfiguration</h2>
        </div>
        <p className="text-gray-500 text-[11px] pl-9 font-medium">System-Basis und Protokollierung.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Core Channels Card */}
        <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/10">
              <Hash size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">System-Kanäle</h3>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Routing</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Log-Kanal (ID)</label>
              <input 
                type="text" 
                name="logChannelId" 
                value={config.logChannelId || ''} 
                onChange={handleChange}
                placeholder="ID..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Transcript-Archiv (ID)</label>
              <input 
                type="text" 
                name="transcriptChannelId" 
                value={config.transcriptChannelId || ''} 
                onChange={handleChange}
                placeholder="ID..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Global Permissions Card */}
        <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/10">
               <Shield size={18} />
             </div>
             <div>
               <h3 className="text-sm font-bold text-white leading-tight">Sicherheit</h3>
               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Management</p>
             </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Support-Manager ID</label>
              <input 
                type="text" 
                name="supportManagerRoleId" 
                value={config.supportManagerRoleId || ''} 
                onChange={handleChange}
                placeholder="Rollen ID..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-xs font-semibold text-gray-400">Live-Sync Aktiv</span>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Notification Settings */}
      <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-white/5 p-6 rounded-2xl shadow-2xl">
         <div className="flex items-center gap-3 mb-6">
            <Globe className="text-orange-400" size={16} />
            <h3 className="text-sm font-bold text-white">System Sprache & Präferenzen</h3>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
               <div className="p-2.5 bg-white/5 rounded-lg text-gray-400">
                 <Globe size={18} />
               </div>
               <div className="flex-1">
                  <h4 className="text-xs font-bold text-white mb-2">Sprache</h4>
                  <select 
                    name="language"
                    value={config.language || 'de'}
                    onChange={handleChange}
                    className="w-full bg-[#1a1b1e] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:ring-1 focus:ring-orange-500/50 appearance-none cursor-pointer"
                  >
                    <option value="de">Deutsch (DE)</option>
                    <option value="en">English (EN)</option>
                  </select>
               </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-70">
               <div className="p-2.5 bg-white/5 rounded-lg text-gray-400">
                 <LogIn size={18} />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-white">Cloud Archivierung</h4>
                  <p className="text-[10px] text-gray-500 font-semibold underline">In Kürze verfügbar</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
