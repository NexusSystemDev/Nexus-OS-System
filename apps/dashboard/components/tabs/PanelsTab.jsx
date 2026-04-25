'use client';

import React, { useState } from 'react';
import { LayoutTemplate, Plus, Trash2, Edit3, Type, Hash, Palette, MousePointer2, ChevronDown, ChevronUp } from 'lucide-react';
import DiscordPreview from '../DiscordPreview';

export default function PanelsTab({ panels, updatePanel, addPanel, removePanel }) {
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
               <LayoutTemplate size={16} />
             </div>
             <h2 className="text-xl font-black text-white tracking-tight">Ticket Panels</h2>
          </div>
          <p className="text-gray-500 text-[11px] pl-9 font-medium">Designe deine Ticket-Einladungen.</p>
        </div>

        <button 
          onClick={addPanel}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          <Plus size={14} />
          Panel hinzufügen
        </button>
      </div>

      {/* Panels Grid */}
      <div className="space-y-3">
        {panels.map((panel) => {
          const isExpanded = expandedId === panel.id;

          return (
            <div 
              key={panel.id} 
              className={`group overflow-hidden bg-[#111214]/40 backdrop-blur-xl border border-white/5 rounded-2xl transition-all duration-300 ${isExpanded ? 'ring-1 ring-orange-500/30' : 'hover:border-white/10'}`}
            >
              {/* Summary Row */}
              <div 
                onClick={() => toggleExpand(panel.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-gray-400 shadow-inner group-hover:text-orange-400 transition-colors">
                    <Edit3 size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">{panel.title || 'Neues Panel'}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                         Kanal: {panel.channelId ? `#${panel.channelId}` : 'Nicht gesetzt'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={(e) => { e.stopPropagation(); removePanel(panel.id); }}
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
                  <div className="pt-6 flex flex-col lg:flex-row gap-8">
                    
                    {/* Settings Area (Left) */}
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Type size={12} /> Panel Titel
                          </label>
                          <input 
                            type="text" 
                            value={panel.title} 
                            onChange={(e) => updatePanel(panel.id, { title: e.target.value })}
                            placeholder="Titel..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Hash size={12} /> Ziel-Kanal (ID)
                          </label>
                          <input 
                            type="text" 
                            value={panel.channelId} 
                            onChange={(e) => updatePanel(panel.id, { channelId: e.target.value })}
                            placeholder="ID..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all font-medium"
                          />
                        </div>

                        <div className="col-span-full space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Edit3 size={12} /> Beschreibung
                          </label>
                          <textarea 
                            value={panel.description} 
                            onChange={(e) => updatePanel(panel.id, { description: e.target.value })}
                            placeholder="Beschreibung..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500/30 transition-all min-h-[80px] font-medium resize-none"
                          />
                        </div>
                      </div>

                      <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                  <Palette size={12} /> Farbe
                                </label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={panel.embedColor} 
                                    onChange={(e) => updatePanel(panel.id, { embedColor: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none outline-none overflow-hidden"
                                  />
                                  <span className="text-[10px] font-mono text-gray-400 uppercase">{panel.embedColor}</span>
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                  <MousePointer2 size={12} /> Button Text
                                </label>
                                <input 
                                  type="text" 
                                  value={panel.buttonText} 
                                  onChange={(e) => updatePanel(panel.id, { buttonText: e.target.value })}
                                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-medium"
                                />
                             </div>
                          </div>

                          <div className="pt-2">
                             <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                <div className="relative">
                                   <input 
                                     type="checkbox" 
                                     checked={panel.useSelectMenu} 
                                     onChange={(e) => updatePanel(panel.id, { useSelectMenu: e.target.checked })}
                                     className="sr-only"
                                   />
                                   <div className={`w-8 h-4 bg-white/5 rounded-full border border-white/10 transition-colors ${panel.useSelectMenu ? 'bg-orange-500/40 border-orange-500/30' : ''}`} />
                                   <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all ${panel.useSelectMenu ? 'translate-x-4' : ''}`} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 group-hover/toggle:text-white transition-colors">Select-Menu nutzen</span>
                             </label>
                          </div>
                      </div>
                    </div>

                    {/* Preview Area (Right) */}
                    <div className="w-full lg:w-[340px] space-y-3">
                       <div className="flex items-center justify-between px-1">
                         <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Live Vorschau</span>
                       </div>
                       <div className="scale-[0.85] origin-top-left">
                          <div className="p-1 bg-white/[0.02] rounded-2xl border border-white/5 shadow-2xl w-[380px]">
                             <DiscordPreview 
                               title={panel.title}
                               description={panel.description}
                               color={panel.embedColor}
                               buttonText={panel.buttonText}
                               useSelectMenu={panel.useSelectMenu}
                             />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {panels.length === 0 && (
          <div className="py-16 text-center glass-card rounded-2xl border-dashed border-white/10 opacity-60">
            <LayoutTemplate className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-md font-bold text-white mb-1">Keine Panels vorhanden</h3>
            <p className="text-gray-500 text-xs">Erstelle dein erstes Panel.</p>
          </div>
        )}
      </div>

    </div>
  );
}
