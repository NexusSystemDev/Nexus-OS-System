import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Github, MessageSquare, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#090a0b] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-20">

          {/* Brand Corner */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <Zap className="text-white" size={24} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="tracking-tighter text-3xl font-black text-white">NEXUS</span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase -mt-1 group-hover:text-orange-400 transition-colors">OS System</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
              Die ultimative Kommandozentrale für Discord-Server. Professionelles Ticket-Management,
              automatisierte Workflows und Echtzeit-Statistiken in einer einzigen, leistungsstarken App.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <Github size={18} />
              </div>
              <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <MessageSquare size={18} />
              </div>
              <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <Twitter size={18} />
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-30">Plattform</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Startseite</Link></li>
                <li><Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Server-Auswahl</Link></li>
                <li><a href="#" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Features</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-30">Hilfe & Support</h4>
              <ul className="space-y-4">
                <li><Link href="/docs" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Dokumentation</Link></li>
                <li><a href="https://discord.gg/nexus-support" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Support Server</a></li>
                <li><Link href="/status" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Status</Link></li>
              </ul>
            </div>
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-30">Rechtliches</h4>
              <ul className="space-y-4">
                <li><Link href="/impressum" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Impressum</Link></li>
                <li><Link href="/privacy" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">Datenschutz</Link></li>
                <li><Link href="/agb" className="text-sm font-bold text-gray-500 hover:text-orange-400 transition-colors">AGB</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-[11px] font-black tracking-widest uppercase">
              &copy; {currentYear} NEXUS OS SYSTEMS
            </span>
            <div className="h-4 w-px bg-white/5 hidden md:block" />
            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <Shield size={12} className="text-emerald-500/50" />
              GDPR COMPLIANT 2026
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Develop by <span className="text-orange-500/50">Nexus OS Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
