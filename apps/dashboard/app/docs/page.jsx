'use client';

import React from 'react';
import { 
  Terminal, BookOpen, Rocket, Shield, 
  Settings, HelpCircle, ArrowLeft, ChevronRight,
  MessageSquare, Zap, LayoutTemplate
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const sections = [
    {
      title: "Erste Schritte",
      icon: <Rocket className="text-orange-400" size={24} />,
      content: [
        { name: "Bot einladen", description: "Lade den NEXUS Bot auf deinen Server ein und gib ihm die Administrator-Berechtigungen." },
        { name: "Dashboard Login", description: "Melde dich mit deinem Discord-Account an und wähle deinen Server aus." },
        { name: "Basis-Setup", description: "Erstelle deine erste Ticket-Kategorie und einen Ticket-Kanal." }
      ]
    },
    {
      title: "Ticket-Konfiguration",
      icon: <Settings className="text-amber-400" size={24} />,
      content: [
        { name: "Kategorien", description: "Definiere Support, Bewerbung oder Partner-Anfragen mit individuellen Rechten." },
        { name: "Rechte-Matrix", description: "Lege präzise fest, welche Team-Rollen welche Tickets sehen und bearbeiten dürfen." },
        { name: "Auto-Ping", description: "Aktiviere automatische Benachrichtigungen für dein Team, wenn Tickets unbeantwortet bleiben." }
      ]
    },
    {
      title: "Befehlsliste",
      icon: <Terminal className="text-emerald-400" size={24} />,
      content: [
        { name: "/setup", description: "Initialisiert das System auf einem neuen Server." },
        { name: "/ticket", description: "Manuelles Erstellen oder Verwalten von Tickets." },
        { name: "/close", description: "Schließt ein aktives Ticket und generiert ein Transkript." }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#090a0b] text-white pt-24 pb-20 px-6 font-sans selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Back Link & Header */}
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Zurück zur Zentrale</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-orange-400 font-bold tracking-widest uppercase text-[10px]">
                <BookOpen size={14} /> Knowledge Base v2.4
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Dokumentation</h1>
              <p className="text-gray-400 max-w-2xl leading-relaxed text-lg font-medium">
                Meistere das NEXUS-System. Von der ersten Einrichtung bis hin zu komplexen Automatisierungen findest du hier alles.
              </p>
            </div>
            <div className="hidden lg:block p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
               <div className="bg-[#0b0c0e] px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Sync: Active</span>
               </div>
            </div>
          </div>
        </div>

        {/* Search Bar Placeholder (Premium UI) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="relative flex items-center bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] backdrop-blur-3xl group-focus-within:border-orange-500/50 transition-all duration-500">
             <Terminal className="text-gray-500 mr-4" size={24} />
             <input 
               type="text" 
               placeholder="Nach Funktionen oder Befehlen suchen..." 
               className="bg-transparent border-none outline-none text-xl font-bold placeholder:text-gray-700 w-full"
             />
             <div className="hidden md:flex gap-2">
                <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-gray-500">CTRL</kbd>
                <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-gray-500">K</kbd>
             </div>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
               </div>
               
               <div className="space-y-4">
                  {section.content.map((item, i) => (
                    <div key={i} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer">
                       <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-200">{item.name}</h3>
                          <ChevronRight size={16} className="text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                       </div>
                       <p className="text-sm text-gray-500 font-medium leading-relaxed">
                          {item.description}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Help Banner */}
        <div className="p-1 px-1 rounded-[3rem] bg-gradient-to-r from-orange-500/20 via-transparent to-amber-500/20">
           <div className="bg-[#0b0c0e] rounded-[2.9rem] border border-white/5 p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                 <h3 className="text-3xl font-black tracking-tight">Immer noch Fragen?</h3>
                 <p className="text-gray-500 max-w-md font-medium">
                    Unser Support-Team ist rund um die Uhr auf unserem Discord-Server für dich da. 
                    Wir helfen dir gerne bei der Einrichtung!
                 </p>
              </div>
              <a 
                href="#" 
                className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 whitespace-nowrap"
              >
                <MessageSquare size={20} /> Support Server beitreten
              </a>
           </div>
        </div>

        {/* Footer info in page */}
        <div className="text-center pt-20 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">NEXUS Dokumentations-Zentrum | Stand: April 2026</p>
        </div>

      </div>
    </main>
  );
}
