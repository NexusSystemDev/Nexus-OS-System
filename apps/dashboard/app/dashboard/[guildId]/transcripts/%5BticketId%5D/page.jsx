'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, Loader2, ShieldAlert, Clock, User, Hash } from 'lucide-react';

export default function TranscriptPage() {
  const { guildId, ticketId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTranscript();
  }, [ticketId]);

  const fetchTranscript = async () => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/transcripts/${ticketId}`);
      if (!res.ok) {
        if (res.status === 403) throw new Error('Zugriff verweigert: Berechtigung fehlt.');
        if (res.status === 404) throw new Error('Transcript nicht gefunden.');
        throw new Error('Fehler beim Laden des Transcripts.');
      }
      const data = await res.json();
      setHtml(data.html);
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
    <div className="min-h-screen bg-[#111214] flex flex-col items-center justify-center text-accent">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-gray-400 font-medium animate-pulse">Ticket-Daten werden sicher abgerufen...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#111214] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
        <ShieldAlert size={32} />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Hoppla!</h1>
      <p className="text-gray-400 max-w-sm mb-8">{error}</p>
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/10"
      >
        <ArrowLeft size={18} />
        Zurück zum Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111214] text-white flex flex-col">
      {/* Control Bar */}
      <header className="h-20 bg-[#1a1b1e]/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-white/5 hover:bg-accent/20 rounded-xl text-gray-400 hover:text-accent-light transition-all border border-white/5 hover:border-accent/30"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <span className="text-accent-light">#</span>{ticketId.substring(ticketId.length - 8)}
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-black tracking-widest ml-2">Archiv</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5 flex items-center gap-2">
              NEXUS Protocol Viewer <span className="w-1 h-1 bg-gray-700 rounded-full" /> Schau dir den Verlauf an
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl transition-all border border-white/5 text-sm font-medium"
          >
            <Printer size={18} />
            Drucken
          </button>
        </div>
      </header>

      {/* Transcript Inner Container */}
      <main className="flex-1 overflow-auto bg-[#313338] print:bg-white print:text-black">
        {/* We use dangerouslySetInnerHTML here because we generate the HTML ourselves in a controlled environment (Bot logic) */}
        <div 
          className="transcript-content"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </main>

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
        
        /* Ensure the bot-generated HTML takes full width/correct styling if needed */
        .transcript-content {
          margin: 0 auto;
          max-width: 100%;
        }
        
        /* Optional: Override some bot styles if they conflict (bot uses #313338 bg which matches here) */
      `}</style>
    </div>
  );
}
