'use client';

import React from 'react';
import { 
  TerminalSquare, Plus, Trash2, Edit3, 
  MessageSquare, LayoutTemplate, Hash, 
  Settings2, Sparkles, ChevronRight, Zap
} from 'lucide-react';

export default function CustomCommandsTab({ commands, updateCommand, addCommand, removeCommand }) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
               <TerminalSquare size={20} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Custom Commands</h2>
          </div>
          <p className="text-gray-500 text-sm pl-11 font-medium">Erstelle eigene Befehle für häufig gestellte Fragen oder Team-Anweisungen.</p>
        </div>

        <button 
          onClick={addCommand}
          className="flex items-center gap-3 bg-white text-black px-6 py-4 rounded-[1.5rem] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
        >
          <Plus size={18} />
          Befehl hinzufügen
        </button>
      </div>

      {/* Placeholder Info Box */}
      <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <Sparkles size={16} />
            <h3 className="font-black uppercase tracking-widest text-xs">Dynamische Variablen</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nutze Platzhalter, um deine Antworten dynamisch zu gestalten. Der Bot ersetzt diese automatisch beim Ausführen.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          {[
            { tag: '{user}', desc: 'Ziel-User' },
            { tag: '{role}', desc: 'Ziel-Rolle' },
            { tag: '{sender}', desc: 'Ausführender' },
            { tag: '{channel}', desc: 'Kanal-Link' },
            { tag: '{guild}', desc: 'Server-Name' }
          ].map(p => (
            <div key={p.tag} className="bg-[#111214]/60 border border-white/5 p-3 rounded-2xl text-center group/tag hover:border-orange-500/30 transition-all">
              <code className="text-orange-400 font-bold block mb-1 group-hover/tag:scale-110 transition-transform">{p.tag}</code>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commands.map((cmd) => (
          <div 
            key={cmd.id} 
            className="group relative bg-[#111214]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-orange-500/30 hover:bg-[#151619]/60"
          >
            {/* Command Trigger Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-400 border border-white/5 group-hover:border-orange-500/20 transition-all group-hover:scale-110">
                   <Zap size={20} />
                </div>
                <div>
                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Slash-Trigger</span>
                   <div className="flex items-center gap-1 text-lg font-black text-white mt-1">
                      <span className="text-orange-500">/</span>
                      <input 
                        type="text" 
                        value={cmd.name} 
                        onChange={(e) => updateCommand(cmd.id, { name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-transparent border-none outline-none focus:text-orange-400 transition-colors w-full"
                        placeholder="befehl-name"
                      />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => removeCommand(cmd.id)}
                className="p-2.5 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  <MessageSquare size={12} /> System-Antwort
               </div>
               <textarea 
                  value={cmd.response} 
                  onChange={(e) => updateCommand(cmd.id, { response: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-medium min-h-[140px] resize-none"
                  placeholder="Was soll der Bot antworten?"
               />
               
               {/* Quick Placeholder Access */}
               <div className="flex flex-wrap gap-2">
                 {['user', 'role', 'sender', 'channel', 'guild'].map(p => (
                   <button 
                    key={p}
                    type="button"
                    onClick={() => updateCommand(cmd.id, { response: (cmd.response || '') + `{${p}}` })}
                    className="text-[10px] bg-white/5 hover:bg-orange-500/10 text-gray-600 hover:text-orange-400 px-2.5 py-1 rounded-lg border border-transparent hover:border-orange-500/20 transition-all font-mono"
                   >
                     {`{${p}}`}
                   </button>
                 ))}
               </div>
               
               {/* Embed Toggle */}
               <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Als Embed senden</span>
                  <button 
                    onClick={() => updateCommand(cmd.id, { isEmbed: !cmd.isEmbed })}
                    className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                      cmd.isEmbed 
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                        : 'bg-white/5 border-white/10 text-gray-600'
                    }`}
                  >
                    {cmd.isEmbed ? 'AKTIVIERT' : 'DEAKTIVIERT'}
                  </button>
               </div>
            </div>

            {/* Glowing Accent */}
            <div className="absolute inset-0 border border-orange-500/5 rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {commands.length === 0 && (
          <div className="col-span-full py-24 text-center glass-card rounded-[3rem] border-dashed border-white/10 opacity-60">
            <TerminalSquare className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Noch keine Custom Commands erstellt</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">Erleichtere deinem Team die Arbeit durch vordefinierte Antworten.</p>
          </div>
        )}
      </div>

    </div>
  );
}
