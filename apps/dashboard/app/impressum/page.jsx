'use client';

import React from 'react';
import { Info, MapPin, Mail, Phone, Globe, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ImpressumPage() {
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
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                     <Info size={28} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Impressum</h1>
               </div>
               <p className="text-gray-400 max-w-2xl leading-relaxed text-lg">
                  Angaben gemäß § 5 TMG. Hier findest du alle rechtlich relevanten Kontaktinformationen.
               </p>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

               {/* Entity Info */}
               <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] space-y-8 col-span-1 md:col-span-2">
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">Betreiber</h3>
                     <div className="space-y-1">
                        <p className="text-2xl font-bold">Texthalter</p>
                        <p className="text-gray-500 font-medium">[STRASSE, HAUSNUMMER]</p>
                        <p className="text-gray-500 font-medium">[PLZ, STADT]</p>
                        <p className="text-gray-500 font-medium">[LAND]</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     <div className="space-y-4">
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">Kontakt</h3>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-gray-300">
                              <Mail size={18} className="text-gray-600" />
                              <span className="font-medium">systemnexusdev@gmail.com</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-300">
                              <Phone size={18} className="text-gray-600" />
                              <span className="font-medium">Texthalter</span>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">Online</h3>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-gray-300">
                              <Globe size={18} className="text-gray-600" />
                              <span className="font-medium">www.nexus-os-system.com</span>
                           </div>
                           <div className="flex items-center gap-3 text-orange-400">
                              <ShieldCheck size={18} className="text-orange-500/50" />
                              <span className="font-black tracking-widest text-[10px] uppercase">Verified Provider</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Legal Clauses */}
               <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                  <h3 className="font-bold text-gray-200">Umsatzsteuer-ID</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                     Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: <br />
                     <span className="text-gray-300">[DEINE USt-ID, falls vorhanden]</span>
                  </p>
               </div>

               <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                  <h3 className="font-bold text-gray-200">Verantwortlich für den Inhalt</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                     Nach § 55 Abs. 2 RStV: <br />
                     <span className="text-gray-300">Philip Plotzki</span>
                  </p>
               </div>

            </div>

            {/* Dispute Resolution */}
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] space-y-4">
               <h3 className="text-xl font-black tracking-tight">EU-Streitschlichtung</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                     https://ec.europa.eu/consumers/odr/
                  </a>.
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
               </p>
            </div>

            <div className="text-center pt-10">
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">NEXUS Legal Standard | Stand: April 2026</p>
            </div>

         </div>
      </main>
   );
}
