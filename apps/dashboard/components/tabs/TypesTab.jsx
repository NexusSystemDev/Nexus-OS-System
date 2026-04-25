'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit3, MessageSquare, Shield, Hash, Settings2, Sparkles, LayoutPanelTop, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

export default function TypesTab({ types, panels, channels, updateType, addType, removeType }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
             <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
               <Tag size={16} />
             </div>
             <h2 className="text-xl font-black text-white tracking-tight">Kategorien & Logik</h2>
          </div>
          <p className="text-gray-500 text-[11px] pl-9 font-medium">Verwalte Ticket-Typen und deren Routing.</p>
        </div>

        <button 
          onClick={addType}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-orange-600/10 active:scale-95"
        >
          <Plus size={14} />
          Kategorie hinzufügen
        </button>
      </div>

      {/* Types Grid */}
      <div className="space-y-3">
        {types.map((type) => {
          const isExpanded = expandedId === type.id;
          
          return (
            <div 
              key={type.id} 
              className={`group overflow-hidden bg-[#111214]/40 backdrop-blur-xl border border-white/5 rounded-2xl transition-all duration-300 ${isExpanded ? 'ring-1 ring-orange-500/30' : 'hover:border-white/10'}`}
            >
              {/* Summary Row (Clickable) */}
              <div 
                onClick={() => toggleExpand(type.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                    {type.emoji || '🎫'}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">{type.name || 'Unbenannte Kategorie'}</h3>
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${type.isActive ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                       <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{type.isActive ? 'Aktiv' : 'Deaktiviert'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={(e) => { e.stopPropagation(); removeType(type.id); }}
                    className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                   >
                    <Trash2 size={16} />
                   </button>
                   <div className="text-gray-500">
                     {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                   </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Side: Messaging & Visuals */}
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <Edit3 size={14} className="text-orange-400" />
                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kategoriename</h4>
                          </div>
                          <input 
                            type="text" 
                            value={type.name || ''} 
                            onChange={(e) => updateType(type.id, { name: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all font-medium"
                            placeholder="z.B. Support"
                          />
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <Edit3 size={14} className="text-orange-400" />
                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Beschreibung</h4>
                          </div>
                          <input 
                            type="text" 
                            value={type.description || ''} 
                            onChange={(e) => updateType(type.id, { description: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all font-medium"
                            placeholder="z.B. Erhalte Hilfe von unserem Team"
                          />
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare size={14} className="text-orange-400" />
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Willkommens-Nachricht</h4>
                          </div>
                          <textarea 
                            value={type.welcomeMessage} 
                            onChange={(e) => updateType(type.id, { welcomeMessage: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all font-medium min-h-[100px] resize-none"
                            placeholder="Begrüßung..."
                          />
                          <p className="text-[9px] text-gray-600 font-bold">Platzhalter: {'{username}'}, {'{name}'}</p>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-amber-400" />
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Embed Titel</h4>
                          </div>
                          <input 
                            type="text" 
                            value={type.embedTitle || ''} 
                            onChange={(e) => updateType(type.id, { embedTitle: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-amber-500/30 transition-all font-medium"
                            placeholder="Support-Ticket: {name}"
                          />
                       </div>
                    </div>

                    {/* Right Side: Logic & Routing */}
                    <div className="space-y-6 p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Status</label>
                             <button 
                               onClick={() => updateType(type.id, { isActive: !type.isActive })}
                               className={`w-full py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${
                                 type.isActive 
                                   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                   : 'bg-white/5 border-white/10 text-gray-500'
                               }`}
                             >
                               {type.isActive ? 'Aktiv' : 'Aus'}
                             </button>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Emoji</label>
                             <input 
                               type="text" 
                               value={type.emoji} 
                               onChange={(e) => updateType(type.id, { emoji: e.target.value })}
                               className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-2 py-1.5 text-center text-sm outline-none focus:border-emerald-500/50"
                               placeholder="🎫"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Panel Zuordnung</label>
                          <select 
                            value={type.panelId} 
                            onChange={(e) => updateType(type.id, { panelId: e.target.value })}
                            className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 appearance-none mb-4"
                          >
                            <option value="">Wähle ein Panel...</option>
                            {panels.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Discord Kategorie (Ziel)</label>
                          <select 
                            value={type.categoryId || ''} 
                            onChange={(e) => updateType(type.id, { categoryId: e.target.value })}
                            className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500/50 appearance-none"
                          >
                            <option value="">Standard-Kategorie...</option>
                            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Channel Name Format</label>
                          <input 
                            type="text" 
                            value={type.channelNameFormat} 
                            onChange={(e) => updateType(type.id, { channelNameFormat: e.target.value })}
                            className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-2.5 text-xs font-mono text-orange-300 outline-none"
                            placeholder="ticket-{username}"
                          />
                          <p className="text-[9px] text-gray-600 font-bold">Platzhalter: {'{username}'}, {'{ticket-id}'}</p>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Support-Rollen (IDs)</label>
                          <input 
                            type="text" 
                            value={type.supportRoles.join(', ')} 
                            onChange={(e) => updateType(type.id, { supportRoles: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                            className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
                            placeholder="ID, ID..."
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Support-User (IDs)</label>
                          <input 
                            type="text" 
                            value={(type.supportUsers || []).join(', ')} 
                            onChange={(e) => updateType(type.id, { supportUsers: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                            className="w-full bg-[#1a1b1e] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
                            placeholder="User ID, User ID..."
                          />
                       </div>

                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {types.length === 0 && (
        <div className="py-16 text-center glass-card rounded-2xl border-dashed border-white/10 opacity-60">
          <Tag className="w-10 h-10 text-gray-600 mx-auto mb-4" />
          <h3 className="text-md font-bold text-white mb-1">Keine Kategorien vorhanden</h3>
          <p className="text-gray-500 max-w-xs mx-auto text-xs">Erstelle deine erste Kategorie, um das Routing zu konfigurieren.</p>
        </div>
      )}

    </div>
  );
}
