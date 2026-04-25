'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Server, ShieldCheck, ChevronRight, 
  Search, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/');
    if (status === 'authenticated') {
      fetchGuilds();
    }
  }, [status]);

  const fetchGuilds = async () => {
    try {
      const res = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter for Manage Server (0x20) or Administrator (0x8)
        const filtered = data.filter(g => {
          const perms = BigInt(g.permissions);
          return (perms & 0x8n) === 0x8n || (perms & 0x20n) === 0x20n;
        });
        setGuilds(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuilds = guilds.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse rounded-full" />
      </div>
      <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] mt-8">Autorisierungsabgleich...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-6 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-orange-500/10 rounded-2xl text-orange-400 border border-orange-500/20">
               <Server size={24} />
             </div>
             <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Deine Portale</h1>
                <div className="flex items-center gap-2 mt-1">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator Zugriff Verifiziert</span>
                </div>
             </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-400 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Server filtern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all w-full md:w-80 shadow-2xl"
          />
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredGuilds.map((guild) => (
          <Link href={`/dashboard/${guild.id}`} key={guild.id} className="group outline-none">
            <div className="relative p-7 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-orange-500/30 rounded-[2.5rem] transition-all duration-500 flex items-center gap-6 shadow-2xl hover:-translate-y-2 group-focus:ring-2 group-focus:ring-orange-500/50">
              
              {/* Guild Icon Wrapper */}
              <div className="relative shrink-0">
                {guild.icon ? (
                  <img 
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`} 
                    alt={guild.name}
                    className="w-20 h-20 rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-white/5"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center text-2xl font-black text-gray-500 group-hover:text-white transition-colors">
                    {guild.name.charAt(0)}
                  </div>
                )}
                {/* Active Indicator Overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#090a0b] border-2 border-white/5 rounded-xl flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate leading-tight group-hover:text-glow transition-all">{guild.name}</h3>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1 group-hover:text-orange-400 transition-colors">Portal betreten</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#2b2d31] group-hover:text-gray-500 transition-colors">
                   Explore <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all">
                 <Sparkles size={48} className="text-orange-500" />
              </div>
            </div>
          </Link>
        ))}

        {guilds.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center glass-card rounded-[3rem] px-6">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-500/20">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Keine Server autorisiert</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
              Du besitzt keine Server mit Administrator-Berechtigungen oder du musst dich neu anmelden.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
