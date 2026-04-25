'use client';

import React from 'react';
import { Scale, FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AGBPage() {
  const sections = [
    {
      title: "1. Geltungsbereich",
      content: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung des NEXUS Ticket-Systems und des zugehörigen Dashboards. Mit der Nutzung unseres Dienstes erklärst du dich mit diesen Bedingungen einverstanden."
    },
    {
      title: "2. Leistungsumfang",
      content: "NEXUS stellt ein webbasiertes Dashboard zur Konfiguration und Verwaltung von Discord-Bots bereit. Wir bemühen uns um eine maximale Verfügbarkeit, können jedoch keine 100%ige Uptime garantieren. Wartungsarbeiten werden in der Regel angekündigt."
    },
    {
      title: "3. Pflichten des Nutzers",
      content: "Der Nutzer ist verpflichtet, den Dienst nicht für rechtswidrige Zwecke zu verwenden. Insbesondere ist der Missbrauch des Ticket-Systems zur Verbreitung von Spam, Malware oder beleidigenden Inhalten untersagt."
    },
    {
      title: "4. Haftungsausschluss",
      content: "NEXUS haftet nicht für Schäden, die durch die Nutzung des Bots auf dem Server des Nutzers entstehen, es sei denn, diese beruhen auf grober Fahrlässigkeit oder Vorsatz unsererseits. Die Verantwortung für die Moderation des Servers liegt beim jeweiligen Server-Eigentümer."
    },
    {
      title: "5. Datenschutz",
      content: "Informationen zur Verarbeitung deiner Daten findest du in unserer Datenschutzerklärung. Wir erfassen nur Daten, die für den Betrieb des Dienstes technisch notwendig sind."
    },
    {
      title: "6. Änderungen der AGB",
      content: "Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche Änderungen werden die Nutzer über das Dashboard oder den Support-Server informiert."
    }
  ];

  return (
    <main className="min-h-screen bg-[#090a0b] text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Zurück zur Zentrale</span>
        </Link>

        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <Scale size={28} />
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Allgemeine Geschäftsbedingungen</h1>
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed text-lg">
            Die rechtliche Grundlage für die Nutzung von NEXUS. Transparent, fair und sicher.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] space-y-4 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-[11px]">
                 <CheckCircle2 size={16} /> {section.title}
              </div>
              <p className="text-gray-400 leading-relaxed text-md font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Footer */}
        <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex items-center gap-6">
           <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-400 shrink-0">
              <AlertCircle size={24} />
           </div>
           <div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Bei Fragen zu unseren AGB kannst du dich jederzeit an unser Team auf dem 
                <a href="#" className="text-orange-400 hover:underline ml-1">Support-Server</a> wenden.
              </p>
           </div>
        </div>

        <div className="text-center pt-10">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">NEXUS Legal Standard | Letztes Update: 16. April 2026</p>
        </div>

      </div>
    </main>
  );
}
