'use client';

import { 
  MessageSquare, LayoutTemplate, ShieldCheck, 
  Zap, ArrowRight, Server, ChevronRight, 
  Terminal, Globe, Sparkles, Activity 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: "Interactive Designer",
      description: "Erstelle visuell ansprechende Nachrichten mit Buttons oder Menüs direkt intuitiv hier im Dashboard.",
      icon: <LayoutTemplate className="w-6 h-6" />,
      color: "from-blue-400 to-amber-600"
    },
    {
      title: "Category Logic",
      description: "Support, Bewerbung oder Partner-Anfragen? Jede Kategorie erhält individuelle Rechte und Texte.",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "Elite Security",
      description: "Lass dein Team in Ruhe arbeiten. Nervige Nutzer werden mit der globalen Blacklist sofort isoliert.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "from-rose-400 to-orange-600"
    },
    {
      title: "Instant Sync",
      description: "Alle Änderungen greifen ohne Verzögerung. Die Kommunikation zwischen Bot und UI erfolgt in Echtzeit.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-400 to-amber-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-500/30">
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-48 overflow-hidden flex flex-col items-center text-center">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/10 blur-[130px] rounded-full animate-float pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/10 blur-[130px] rounded-full animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }} />

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-10 backdrop-blur-xl group hover:border-orange-500/30 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249, 115, 22,0.8)]" />
            NEXUS System v2.4 Status: Operational
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight max-w-5xl">
            Professionelle <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-amber-500 drop-shadow-2xl">
              Ticket-Logistik
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Revolutioniere die Kommunikation auf deinem Server. Konfiguriere Panels, Berechtigungen und Archiv-Systeme in einer High-End Umgebung.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Link 
              href="/dashboard" 
              className="group relative px-10 py-5 bg-white text-black rounded-[2rem] font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Jetzt Starten <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 duration-500" />
            </Link>
            
            <a 
              href="#features" 
              className="px-10 py-5 rounded-[2rem] bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white font-bold text-lg transition-all backdrop-blur-xl active:scale-95"
            >
              Features ansehen
            </a>
          </div>
        </div>

        {/* Visual Decoration Overlay: The 'Live' Dashboard Preview */}
        <div className="mt-24 w-full max-w-6xl mx-auto group perspective-1000">
           <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-br from-white/20 via-orange-500/20 to-transparent shadow-2xl transition-all duration-1000 group-hover:scale-[1.02] group-hover:rotate-x-1">
              <div className="bg-[#0b0c0e] rounded-[2.9rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(249, 115, 22,0.1)]">
                 
                 {/* Top Bar (Browser/App Look) */}
                 <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/30" />
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Master Cluster: DE-FRA-01
                       </div>
                    </div>
                 </div>

                 {/* Mockup Body */}
                 <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(249, 115, 22,0.05),transparent_70%)]">
                    
                    {/* Hero Sidebar Mockup */}
                    <div className="lg:col-span-4 space-y-6">
                       <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
                                <Activity size={20} />
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Load</p>
                                <p className="text-xl font-black text-white">4.2%</p>
                             </div>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 w-[42%]" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                             <div key={i} className="flex items-center gap-4 px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                                <div className="h-2 w-24 bg-white/5 rounded-full" />
                                <div className="h-2 w-8 bg-white/5 rounded-full ml-auto" />
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Main Log/Graph Mockup */}
                    <div className="lg:col-span-8 space-y-8">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Terminal className="text-orange-400" size={18} />
                             <span className="text-xs font-black text-white tracking-[0.2em] uppercase">Live-System Feed</span>
                          </div>
                          <div className="flex gap-2">
                             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                          </div>
                       </div>

                       <div className="bg-black/40 rounded-[2rem] border border-white/5 p-6 font-mono text-[11px] space-y-2.5 overflow-hidden ring-1 ring-white/5">
                          <p className="text-emerald-500 flex items-center gap-3">
                             <span className="text-gray-700">12:30:12</span> 
                             <span className="px-1.5 py-0.5 bg-emerald-500/10 rounded uppercase text-[8px] font-black">Success</span>
                             [Worker] Auto-Ping sent to Ticket #0421
                          </p>
                          <p className="text-blue-400 flex items-center gap-3">
                             <span className="text-gray-700">12:30:18</span>
                             <span className="px-1.5 py-0.5 bg-blue-500/10 rounded uppercase text-[8px] font-black">Config</span>
                             [Database] GuildConfig sync completed for Gid: 125...
                          </p>
                          <p className="text-orange-400 flex items-center gap-3 animate-pulse">
                             <span className="text-gray-700">12:30:45</span>
                             <span className="px-1.5 py-0.5 bg-orange-500/10 rounded uppercase text-[8px] font-black">System</span>
                             [NEXUS] Awaiting interaction context...
                          </p>
                          <p className="text-gray-600 flex items-center gap-3 opacity-30">
                             <span>12:31:02</span> 
                             <span>[Bot] Heartbeat pulse detected (Shards: 1)</span>
                          </p>
                       </div>

                       <div className="grid grid-cols-3 gap-4 h-24">
                          {[60, 40, 90, 30, 70, 50, 80, 45, 65, 35, 75, 55, 85, 40, 95].map((h, i) => (
                             <div key={i} className="flex-1 bg-gradient-to-t from-orange-500/20 to-transparent rounded-t-lg border-x border-t border-white/5" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                    </div>

                 </div>
              </div>

              {/* Decorative Glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-bold tracking-widest uppercase text-[10px] mb-3">
              <Sparkles size={14} /> Intelligence Core
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Gemacht für Team <br /> & Infrastruktur
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm font-medium leading-loose">
            Unser Interface kombiniert mächtige Backend-Logik mit einem Interface, das man gerne benutzt. Keine Code-Kenntnisse nötig.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="group bg-white/[0.02] border border-white/5 hover:border-orange-500/30 p-10 rounded-[2.5rem] transition-all duration-500 flex flex-col items-start hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/5 backdrop-blur-3xl">
              <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-black/20 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium pr-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Stats (Compact) */}
      <section className="py-24 border-t border-white/5 bg-[#090a0b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-1000">
          <div>
            <p className="text-3xl font-black text-white">5K+</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-2">Active Servers</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">0.2s</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-2">Response Time</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">24/7</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-2">Uptime Monitor</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">E2EE</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-2">Data Security</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 flex flex-col items-center gap-6 opacity-30">
        <span className="text-xs font-black tracking-[0.4em] text-gray-500 uppercase">NEXUS • Tactical Management Suite</span>
      </footer>
    </div>
  )
}
