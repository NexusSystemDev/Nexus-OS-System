'use client';

import React from 'react';
import { Shield, Lock, Eye, Database, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#090a0b] text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Zurück zur Startseite</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Shield size={24} />
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Datenschutzerklärung</h1>
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Der Schutz deiner Daten ist uns wichtig. Hier erfährst du genau, welche Daten wir speichern, warum wir das tun und wie wir mit deinen Informationen umgehen.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Card: Account Info */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-4 text-orange-400 mb-2">
               <Lock size={20} />
               <h3 className="text-xl font-black uppercase tracking-widest text-sm">Akkount-Daten (OAuth2)</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Wenn du dich über Discord in unser Dashboard einloggst, speichern wir:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 ml-2">
              <li>Deine eindeutige Discord User-ID</li>
              <li>Deinen Benutzernamen und dein Profilbild</li>
              <li>Verschlüsselte Access- & Refresh-Tokens (um deine Server-Berechtigungen zu prüfen)</li>
            </ul>
          </div>

          {/* Card: Bot & Tickets */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-4 text-amber-400 mb-2">
               <Database size={20} />
               <h3 className="text-xl font-black uppercase tracking-widest text-sm">Bot-Interaktionen & Tickets</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Um den Ticket-Service auf deinem Server bereitzustellen, speichern wir:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 ml-2">
              <li>**Konfiguration:** Deine Server-IDs, Kanal-IDs und Rollen-Einstellungen.</li>
              <li>**Transkripte:** Der vollständige Textverlauf deiner Tickets inkl. Links zu Anhängen. Dies dient der Dokumentation für das Server-Team.</li>
              <li>**Logs:** Metadaten wie Erstellungszeitpunkt, Bearbeiter (Claimer) und Löschzeitpunkt eines Tickets.</li>
            </ul>
          </div>

          {/* Card: Usage & Rights */}
          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] space-y-6">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Eye size={24} className="text-emerald-400" />
              Warum wir das speichern?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Wir nutzen diese Daten ausschließlich, um die Funktionalität unseres Systems zu gewährleisten. Transkripte werden gespeichert, damit Administratoren später auf Informationen aus Support-Fällen zugreifen können (Audit-Log).
            </p>
            
            <div className="h-px w-full bg-white/5 my-4" />

            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Trash2 size={24} className="text-rose-400" />
              Löschung & Widerruf
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Du hast jederzeit das Recht, die Löschung deiner Daten zu verlangen. Wenn du den Bot von deinem Server entfernst oder dein Konto im Dashboard löschst (via Support), werden alle verknüpften Konfigurationen entfernt. Transkripte können manuell durch das Server-Team oder automatisch nach Ablauf der eingestellten Zeit im Dashboard gelöscht werden.
            </p>
          </div>

        </div>

        {/* Footer info in page */}
        <div className="text-center pt-10">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">NEXUS Security Standard | Stand: April 2026</p>
        </div>

      </div>
    </main>
  );
}
