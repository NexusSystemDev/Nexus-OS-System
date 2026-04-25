'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Printer, Loader2, ShieldAlert, 
  Calendar, User, Hash, Tag, Activity, 
  Clock, Server, ExternalLink, Download
} from 'lucide-react';

export default function TranscriptPage() {
  const { guildId, ticketId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticketId) fetchTranscript();
  }, [ticketId]);

  const fetchTranscript = async () => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/transcripts/${ticketId}`);
      if (!res.ok) {
        if (res.status === 403) throw new Error('Zugriff verweigert: Berechtigung fehlt.');
        if (res.status === 404) throw new Error('Transcript nicht gefunden.');
        throw new Error('Fehler beim Laden des Transcripts.');
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#090a0b] flex flex-col items-center justify-center text-accent">
      <div className="relative">
        <Loader2 className="animate-spin text-accent-light" size={64} />
        <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse rounded-full" />
      </div>
      <p className="text-gray-400 font-medium mt-8 animate-pulse tracking-widest uppercase text-xs">Abrufen der Protokolle...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#090a0b] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">System-Sperre</h1>
      <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">{error}</p>
      <Link 
        href={`/dashboard/${guildId}`}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition-all border border-white/10 font-semibold group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Zurück zur Basis
      </Link>
    </div>
  );

  const { ticket, html } = data;
  const shortId = ticket.id.substring(ticket.id.length - 8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#090a0b] text-gray-300 font-sans selection:bg-accent/30 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Control Header */}
      <header className="h-20 bg-[#111214]/60 backdrop-blur-2xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-[100] print:hidden shadow-xl">
        <div className="flex items-center gap-6">
          <Link 
            href={`/dashboard/${guildId}`}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20 active:scale-95 shadow-lg"
            title="Zurück zum Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-accent/10 text-accent-light px-2.5 py-1 rounded-lg border border-accent/20 uppercase font-black tracking-[0.2em]">Audit Log</span>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash size={14} className="text-gray-600" />
                {shortId}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Verifiziert durch NEXUS Protocol</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2.5 bg-accent/10 hover:bg-accent/20 text-accent-light px-5 py-2.5 rounded-xl transition-all border border-accent/20 text-sm font-bold shadow-lg shadow-accent/5 active:scale-95"
          >
            <Printer size={18} />
            Protokoll Drucken
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 lg:p-8 gap-8 relative z-10">
        
        {/* Left: Transcript Container */}
        <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-4 duration-700">
           <div className="bg-[#111214] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
              {/* Inner Glow Surround */}
              <div className="absolute inset-0 border border-accent/5 rounded-[2.5rem] pointer-events-none z-10" />
              
              <div className="p-4 sm:p-8 bg-[#313338] min-h-[800px] print:bg-white print:text-black">
                <div 
                  className="transcript-content prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }} 
                />
              </div>
           </div>
        </div>

        {/* Right: Meta Sidebar */}
        <aside className="w-full lg:w-[380px] space-y-6 flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-150 print:hidden">
          
          {/* Status & Server Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-5">Systemstatus</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                    <Activity size={18} />
                  </div>
                  <span className="text-sm font-semibold text-white">Status</span>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/20">{ticket.status}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2 rounded-xl text-accent-light">
                    <Tag size={18} />
                  </div>
                  <span className="text-sm font-semibold text-white">Kategorie</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <span>{ticket.type?.emoji}</span>
                  <span>{ticket.type?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User History Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-5">Beteiligte Personen</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-inner">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ersteller</p>
                  <p className="text-sm font-mono text-white mt-0.5">{ticket.creatorId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-75">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 border border-white/5">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bearbeiter (Claim)</p>
                  <p className="text-sm font-mono text-gray-300 mt-0.5">{ticket.claimedById || 'Nicht beansprucht'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp Archive Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Clock size={80} className="text-accent" />
            </div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-5">Timeline</h3>
            <div className="space-y-5 relative z-10">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/10" />
                  <div className="w-0.5 flex-1 bg-white/5 my-1" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold tracking-wider">ERSTELLT</p>
                  <p className="text-[13px] text-white font-medium mt-0.5">{new Date(ticket.createdAt).toLocaleString('de-DE')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/10" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold tracking-wider">GESCHLOSSEN (ARCHIVIERT)</p>
                  <p className="text-[13px] text-white font-medium mt-0.5">{new Date(ticket.closedAt).toLocaleString('de-DE')}</p>
                </div>
              </div>
            </div>
          </div>
          
        </aside>
      </div>

      {/* Footer Info */}
      <footer className="py-10 border-t border-white/5 text-center bg-[#090a0b] print:hidden">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Nexus Cryptography & Logic Security • Protocol v2.4.0</p>
      </footer>

      <style jsx global>{`
        /* Custom print styles */
        @media print {
          .transcript-content {
            padding: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
        }
        
        .transcript-content {
          margin: 0 auto;
          max-width: 100%;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #090a0b;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e1f22;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2b2d31;
        }
      `}</style>
    </div>
  );
}
