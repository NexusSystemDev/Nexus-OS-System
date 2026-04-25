'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Loader2, Save, X, Plus, UserCircle2, ArrowRight, Check } from 'lucide-react';

export default function PermissionsMatrixTab({ guildId }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionList, setPermissionList] = useState([
    { id: 'DASHBOARD', name: 'Dashboard Zugriff', description: 'Erlaubt das Einloggen und Verwalten des Dashboards.' },
    { id: 'TICKET_VIEW', name: 'Tickets Einsehen', description: 'Erlaubt das Lesen von Tickets (Support-Team).' },
    { id: 'TICKET_CLAIM', name: 'Tickets Claimen', description: 'Erlaubt das Übernehmen von Tickets.' },
    { id: 'TICKET_CLOSE', name: 'Tickets Schließen', description: 'Erlaubt das Beenden von Gesprächen.' },
    { id: 'TICKET_DELETE', name: 'Tickets Löschen', description: 'Erlaubt das endgültige Entfernen von Kanälen.' }
  ]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/permissions`);
      if (res.ok) {
        setRoles(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (roleId, permission) => {
    setSaving(true);
    try {
      const role = roles.find(r => r.roleId === roleId);
      const currentPerms = role ? role.permissions : [];
      let newPerms;
      
      if (currentPerms.includes(permission)) {
        newPerms = currentPerms.filter(p => p !== permission);
      } else {
        newPerms = [...currentPerms, permission];
      }

      const res = await fetch(`/api/guilds/${guildId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, permissions: newPerms })
      });

      if (res.ok) {
        await fetchPermissions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addRole = async () => {
    const roleId = prompt('Bitte gib die Rollen-ID ein, die du hinzufügen möchtest:');
    if (!roleId) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/guilds/${guildId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, permissions: ['DASHBOARD'] })
      });
      if (res.ok) await fetchPermissions();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (roleId) => {
    if (!confirm('Möchtest du diese Rolle wirklich aus der Matrix entfernen?')) return;
    setSaving(true);
    try {
      await fetch(`/api/guilds/${guildId}/permissions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      });
      await fetchPermissions();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Team-Konfiguration wird abgeglichen...</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
               <Shield size={20} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Team</h2>
          </div>
          <p className="text-gray-500 text-sm pl-11 font-medium">Definiere präzise Berechtigungen für deine Team-Rollen.</p>
        </div>

        <button 
          onClick={addRole}
          className="flex items-center gap-3 bg-white text-black px-6 py-4 rounded-[1.5rem] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
        >
          <Plus size={18} />
          Rolle hinzufügen
        </button>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-[#111214]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] w-[250px]">Support Rolle (ID)</th>
                {permissionList.map(p => (
                  <th key={p.id} className="px-6 py-6 text-center group cursor-help relative">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap block">
                      {p.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-gray-600 block leading-none mt-1">
                      {p.name.split(' ')[1] || ''}
                    </span>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{p.name}</p>
                       <p className="text-[10px] text-gray-400 leading-relaxed font-medium">{p.description}</p>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-6 text-right w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {roles.map((role) => (
                <tr key={role.roleId} className="group hover:bg-white/[0.03] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-orange-400 border border-white/5">
                        <UserCircle2 size={20} />
                      </div>
                      <span className="text-xs font-mono text-white font-medium">{role.roleId}</span>
                    </div>
                  </td>
                  
                  {permissionList.map(p => (
                    <td key={p.id} className="px-6 py-6 text-center">
                      <button 
                        disabled={saving}
                        onClick={() => togglePermission(role.roleId, p.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all mx-auto active:scale-95 ${
                          role.permissions.includes(p.id)
                            ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249, 115, 22,0.4)]'
                            : 'bg-white/5 text-gray-700 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {role.permissions.includes(p.id) ? (
                          <ShieldCheck size={16} />
                        ) : (
                          <Shield size={16} />
                        )}
                      </button>
                    </td>
                  ))}

                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => deleteRole(role.roleId)}
                      className="p-2.5 bg-white/5 hover:bg-rose-500/10 text-gray-600 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-500/10"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {roles.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mx-auto mb-6 border border-white/5">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Matrix ist leer</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Füge eine Rolle hinzu, um Berechtigungen festzulegen.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row items-center gap-8">
         <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center text-orange-400 border border-orange-500/10 shrink-0">
            <ShieldCheck size={32} />
         </div>
         <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Präzise Rollenzuweisung</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">NEXUS nutzt eine hybride Berechtigungsprüfung. Rollen in dieser Matrix können unabhängig von Discord-Berechtigungen spezifische Aktionen im Dashboard und in Ticket-Kanälen ausführen.</p>
         </div>
         <div className="ml-auto shrink-0 hidden md:block">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
               Verifiziert <Check size={12} className="text-emerald-500" />
            </div>
         </div>
      </div>

    </div>
  );
}
