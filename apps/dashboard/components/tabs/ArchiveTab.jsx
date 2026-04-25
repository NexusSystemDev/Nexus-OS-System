'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, Search, ExternalLink, Calendar, 
  User, Ticket, Loader2, Filter, ChevronRight, 
  Clock, ArrowUpRight, ShieldCheck 
} from 'lucide-react';

export default function ArchiveTab({ guildId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/transcripts`);
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.typeName.toLowerCase().includes(search.toLowerCase()) ||
    item.creatorId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
      <Loader2 className="animate-spin text-accent mb-4" size={48} />
      <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Lade Archiv...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-accent/10 rounded-xl text-accent-light border border-accent/20">
               <History size={20} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Ticket Transcript</h2>
          </div>
          <p className="text-gray-400 text-sm pl-11">Sichere Verwaltung und Auditierung aller geschlossenen Vorgänge.</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="ID, Ersteller oder Typ suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1a1b1e]/60 backdrop-blur-xl border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all w-full md:w-80 shadow-2xl"
          />
        </div>
      </div>

      {/* Stats Quick Grid (Implicit context) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gesamt Archiviert</p>
            <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">ID & Typ</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ersteller</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Zeitraum</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-light border border-white/5 group-hover:border-accent/30 transition-all group-hover:scale-105 shadow-inner">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500">#</span>
                          <span className="text-sm font-bold text-white group-hover:text-accent-light transition-colors">{item.shortId}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs">{item.typeEmoji}</span>
                          <span className="text-xs text-gray-400 font-medium">{item.typeName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600 border border-white/5">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-mono text-gray-400">{item.creatorId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <Calendar size={12} className="text-accent/50" />
                        {new Date(item.createdAt).toLocaleDateString('de-DE')}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold lowercase tracking-wider">
                        <Clock size={10} />
                        Geschlossen am {new Date(item.closedAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a 
                      href={`/dashboard/${guildId}/transcripts/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent/10 hover:bg-accent hover:text-white text-accent-light px-5 py-2.5 rounded-xl transition-all border border-accent/20 hover:border-accent shadow-lg shadow-accent/5 group/btn"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">Details</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mx-auto mb-6 border border-white/5">
                <Filter size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Keine Einträge gefunden</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Vielleicht hilft ein anderer Suchbegriff weiter?</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
