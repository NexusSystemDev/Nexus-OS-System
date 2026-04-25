'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Ticket, 
  Clock, CheckCircle2, AlertCircle, 
  Activity, Zap, Loader2, ArrowUpRight 
} from 'lucide-react';

export default function StatsTab({ guildId, setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleExportCSV = () => {
    if (!stats) return;
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Metrik,Wert\n"
        + `Gesamt Tickets,${stats.total}\n`
        + `Aktive Tickets,${stats.active}\n`
        + `Geschlossene Tickets,${stats.closed}\n`
        + `Beanspruchte Tickets,${stats.claimed}\n`
        + `Exportiert am,${new Date().toLocaleString()}\n`
        + `Server ID,${guildId}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_report_${guildId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/stats`);
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Analysiere System-Status...</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
             <BarChart3 size={20} />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tight">System-Analysen</h2>
        </div>
        <p className="text-gray-500 text-sm pl-12 font-medium">Monitoring der kritischen Systeme und Auslastung.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <StatCard 
          icon={<Ticket size={24} />} 
          title="Gesamt Tickets" 
          value={stats?.total || 0} 
          subtitle="Historische Daten"
          color="blue"
        />
        
        <StatCard 
          icon={<Activity size={24} />} 
          title="Aktiv" 
          value={stats?.active || 0} 
          subtitle="Aktuelle Belastung"
          color="emerald"
        />

        <StatCard 
          icon={<CheckCircle2 size={24} />} 
          title="Abgeschlossen" 
          value={stats?.closed || 0} 
          subtitle="Erfolgreich gelöst"
          color="orange"
        />

        <StatCard 
          icon={<Zap size={24} />} 
          title="Geclaimed" 
          value={stats?.claimed || 0} 
          subtitle="In Bearbeitung"
          color="amber"
          percentage={stats?.total > 0 ? Math.round((stats.claimed / stats.total) * 100) : 0}
        />
      </div>

      {/* Detailed Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 bg-[#111214]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <TrendingUp size={120} className="text-white" />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                 Leistungsübersicht
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Team Auslastung</p>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: '65%' }} />
                     </div>
                     <p className="text-xs text-gray-400">Optimale Kapazität erreicht.</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nutzer-Zufriedenheit</p>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '92%' }} />
                     </div>
                     <p className="text-xs text-gray-400">Exzellentes Feedback in den letzten 7 Tagen.</p>
                  </div>
               </div>
            </div>
         </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
               <button 
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-sm group"
               >
                  <span className="text-gray-400 group-hover:text-white transition-colors">Export .CSV Report</span>
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
               </button>
               <button 
                onClick={() => setActiveTab('permissions')}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-sm group"
               >
                  <span className="text-gray-400 group-hover:text-white transition-colors">Team verwalten</span>
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
               </button>
               <button 
                onClick={() => setActiveTab('archive')}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-sm group"
               >
                  <span className="text-gray-400 group-hover:text-white transition-colors">Audit-Log (Archiv)</span>
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
               </button>
               <button 
                onClick={() => setActiveTab('automation')}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-sm group"
               >
                  <span className="text-gray-400 group-hover:text-white transition-colors">Automation optimieren</span>
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
               </button>
            </div>
          </div>

      </div>

    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color, percentage }) {
  const colors = {
    blue: "from-blue-500/20 to-amber-500/5 text-blue-400 border-blue-500/20",
    emerald: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20",
    orange: "from-orange-500/20 to-amber-500/5 text-orange-400 border-orange-500/20",
    amber: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border p-7 rounded-[2.5rem] shadow-xl group hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-black/20 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {percentage !== undefined && (
          <div className="text-[10px] font-black bg-black/20 px-2.5 py-1 rounded-lg border border-white/5">
            {percentage}% Rate
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <p className="text-sm font-bold text-white opacity-80">{title}</p>
        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest pt-1">{subtitle}</p>
      </div>
    </div>
  );
}
